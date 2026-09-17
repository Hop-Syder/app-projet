import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dtos/product.dto';
import { generateSlug } from '../../utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const { cutOptions, imageUrls, ...productData } = createProductDto;

    // Vérifier que le slug est unique
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Un produit avec ce slug existe déjà');
    }

    // Créer le produit avec ses options de découpe
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        createdBy: userId,
        cutOptions: cutOptions
          ? {
              create: cutOptions.map((option) => ({
                name: option.name,
                description: option.description,
                additionalPrice: option.additionalPrice || 0,
              })),
            }
          : undefined,
        images: imageUrls
          ? {
              create: imageUrls.map((url, index) => ({
                url,
                position: index,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        animal: true,
        cutOptions: true,
        images: true,
        lots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return product;
  }

  async findAll(queryDto: ProductQueryDto) {
    const {
      search,
      categoryId,
      animalId,
      saleMode,
      minPrice,
      maxPrice,
      isAvailable,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = queryDto;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (animalId) {
      where.animalId = animalId;
    }

    if (saleMode) {
      where.saleMode = saleMode;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          animal: true,
          cutOptions: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          lots: {
            where: { quantityAvailable: { gt: 0 } },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        animal: true,
        cutOptions: true,
        images: {
          orderBy: { position: 'asc' },
        },
        lots: {
          where: { quantityAvailable: { gt: 0 } },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    return product;
  }

  async findOneBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        animal: true,
        cutOptions: true,
        images: {
          orderBy: { position: 'asc' },
        },
        lots: {
          where: { quantityAvailable: { gt: 0 } },
          orderBy: { createdAt: 'desc' },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { customer: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec le slug ${slug} non trouvé`);
    }

    // Incrémenter le compteur de vues
    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    const { cutOptions, imageUrls, ...productData } = updateProductDto;

    // Vérifier si le produit existe
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    // Vérifier l'unicité du slug s'il est modifié
    if (productData.slug && productData.slug !== existingProduct.slug) {
      const productWithSameSlug = await this.prisma.product.findUnique({
        where: { slug: productData.slug },
      });

      if (productWithSameSlug) {
        throw new ConflictException('Un produit avec ce slug existe déjà');
      }
    }

    // Mettre à jour le produit
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        updatedBy: userId,
        cutOptions: cutOptions
          ? {
              deleteMany: {},
              create: cutOptions.map((option) => ({
                name: option.name,
                description: option.description,
                additionalPrice: option.additionalPrice || 0,
              })),
            }
          : undefined,
        images: imageUrls
          ? {
              deleteMany: {},
              create: imageUrls.map((url, index) => ({
                url,
                position: index,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        category: true,
        animal: true,
        cutOptions: true,
        images: true,
        lots: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }

    // Soft delete ou vérification des commandes associées
    await this.prisma.product.update({
      where: { id },
      data: { isAvailable: false },
    });

    return { message: 'Produit désactivé avec succès' };
  }

  async checkAvailability(productId: string, requestedQuantity: number): Promise<{
    available: boolean;
    availableQuantity: number;
    message?: string;
  }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        lots: {
          where: { quantityAvailable: { gt: 0 } },
          orderBy: { expirationDate: 'asc' },
        },
      },
    });

    if (!product || !product.isAvailable) {
      return {
        available: false,
        availableQuantity: 0,
        message: 'Produit non disponible',
      };
    }

    let totalAvailable = 0;
    for (const lot of product.lots) {
      totalAvailable += lot.quantityAvailable;
    }

    if (product.saleMode === 'unit') {
      return {
        available: totalAvailable >= requestedQuantity,
        availableQuantity: totalAvailable,
        message:
          totalAvailable >= requestedQuantity
            ? undefined
            : `Seulement ${totalAvailable} unités disponibles`,
      };
    }

    // Pour les produits au poids
    return {
      available: totalAvailable >= requestedQuantity,
      availableQuantity: totalAvailable,
      message:
        totalAvailable >= requestedQuantity
          ? undefined
          : `Seulement ${totalAvailable} kg disponibles`,
    };
  }

  async findFeatured(limit = 8) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        isFeatured: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        animal: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
  }

  async findByCategory(categorySlug: string, limit = 20) {
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie ${categorySlug} non trouvée`);
    }

    return this.prisma.product.findMany({
      where: {
        categoryId: category.id,
        isActive: true,
        isAvailable: true,
      },
      take: limit,
      orderBy: { orderCount: 'desc' },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
  }
}
