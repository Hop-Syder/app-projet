import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: any) {
    const {
      search,
      categoryId,
      animalId,
      saleMode,
      minPrice,
      maxPrice,
      isAvailable,
      page = 1,
      limit = 20,
    } = filters || {};

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
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

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === 'true';
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          animal: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          cutOptions: {
            where: { isActive: true },
          },
          packagingOptions: {
            where: { isActive: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    };
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        animal: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        videos: {
          orderBy: { sortOrder: 'asc' },
        },
        cutOptions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        packagingOptions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        stock: {
          where: { status: 'AVAILABLE' },
        },
        reviews: {
          where: { isApproved: true },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
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
