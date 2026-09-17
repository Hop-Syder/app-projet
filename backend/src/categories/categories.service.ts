import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly: boolean = true) {
    return this.prisma.category.findMany({
      where: activeOnly ? { active: true } : {},
      include: {
        parent: true,
        children: true,
        products: {
          where: { active: true, isAvailable: true },
          take: 5,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { active: true, isAvailable: true },
          include: {
            images: true,
            cutOptions: true,
            packagingOptions: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        products: {
          where: { active: true, isAvailable: true },
          include: {
            images: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    imageUrl?: string;
    position?: number;
  }) {
    return this.prisma.category.create({
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async getTree() {
    const rootCategories = await this.prisma.category.findMany({
      where: {
        parentId: null,
        active: true,
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
        products: {
          where: { active: true, isAvailable: true },
          take: 3,
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });

    return rootCategories;
  }
}
