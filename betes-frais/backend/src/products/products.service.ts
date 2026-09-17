import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService, SaleMode } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dtos/product.dto';
import { generateSlug } from '../../utils/slug.util';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    const { cutOptions, imageUrls, ...productData } = createProductDto;

    // Générer le slug si non fourni
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Vérifier que le slug est unique
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Un produit avec ce slug existe déjà');
    }

    // Créer le produit avec ses images
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        cutOptions: cutOptions ? JSON.stringify(cutOptions) : null,
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
        images: true,
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
      where.saleMode = saleMode as any;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.pricePerKg = {};
      if (minPrice !== undefined) where.pricePerKg.gte = minPrice;
      if (maxPrice !== undefined) where.pricePerKg.lte = maxPrice;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    where.isActive = true;

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          animal: true,
          images: {
            where: { isPrimary: true },
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
        images: {
          orderBy: { position: 'asc' },
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
        images: {
          orderBy: { position: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec le slug ${slug} non trouvé`);
    }

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
    const updateData: any = { ...productData };
    
    if (cutOptions !== undefined) {
      updateData.cutOptions = cutOptions ? JSON.stringify(cutOptions) : null;
    }
    
    if (imageUrls) {
      updateData.images = {
        deleteMany: {},
        create: imageUrls.map((url, index) => ({
          url,
          position: index,
          isPrimary: index === 0,
        })),
      };
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        animal: true,
        images: true,
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
        inventoryItems: {
          where: { isAvailable: true },
          orderBy: { expiresAt: 'asc' },
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
    for (const item of product.inventoryItems) {
      totalAvailable += Number(item.quantity);
    }

    // Pour les produits au poids ou à l'unité
    return {
      available: totalAvailable >= requestedQuantity,
      availableQuantity: totalAvailable,
      message:
        totalAvailable >= requestedQuantity
          ? undefined
          : `Seulement ${totalAvailable} ${product.saleMode === 'UNIT' ? 'unités' : 'kg'} disponibles`,
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
