import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('Un catégorie avec ce slug existe déjà');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        parentId: dto.parentId,
        imageUrl: dto.imageUrl,
        icon: dto.icon,
        sortOrder: dto.sortOrder ?? 0,
        isActive: dto.isActive ?? true,
        isFeatured: dto.isFeatured ?? false,
      },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true, isAvailable: true },
          take: 3,
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findAll(query: CategoryQueryDto) {
    const { page = 1, limit = 20, isActive, isFeatured, parentId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (parentId) {
      where.parentId = parentId;
    } else if (parentId === 'root') {
      where.parentCategory = { is: null };
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          parent: true,
          children: {
            take: 5,
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
          products: {
            where: { isActive: true, isAvailable: true },
            take: 3,
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
          _count: {
            select: { products: true },
          },
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { isActive: true, isAvailable: true },
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
            animal: true,
            category: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    return category;
  }

  async findOneBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { products: true },
            },
          },
        },
        products: {
          where: { isActive: true, isAvailable: true },
          orderBy: { orderCount: 'desc' },
          take: 12,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
            animal: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie avec le slug ${slug} non trouvée`);
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });
      if (slugExists) {
        throw new BadRequestException('Un catégorie avec ce slug existe déjà');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        parentId: dto.parentId,
        imageUrl: dto.imageUrl,
        icon: dto.icon,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
        isFeatured: dto.isFeatured,
      },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }

    if (existing.children.length > 0) {
      throw new BadRequestException('Impossible de supprimer une catégorie avec des sous-catégories');
    }

    if (existing.products.length > 0) {
      throw new BadRequestException('Impossible de supprimer une catégorie avec des produits');
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Catégorie supprimée avec succès' };
  }

  async getTree() {
    const rootCategories = await this.prisma.category.findMany({
      where: { parentId: { is: null } },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' },
          include: {
            children: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                name: true,
                slug: true,
                imageUrl: true,
              },
            },
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    return rootCategories;
  }
}
