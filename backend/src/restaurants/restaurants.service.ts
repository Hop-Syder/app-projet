import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .concat(`-${Math.random().toString(36).slice(2, 6)}`);
  }

  async findAll(filters?: {
    cuisineType?: string;
    priceRange?: string;
    search?: string;
    isActive?: boolean;
  }) {
    const where: any = {};

    if (filters?.cuisineType) {
      where.cuisineType = filters.cuisineType;
    }

    if (filters?.priceRange) {
      where.priceRange = filters.priceRange;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.restaurant.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restaurant;
  }

  async create(data: {
    ownerId: string;
    name: string;
    slug?: string;
    description?: string;
    address: string;
    phone?: string;
    email?: string;
    cuisineType?: string;
    priceRange?: string;
    deliveryRadius?: number;
    minimumOrder?: number;
    preparationTime?: number;
    isActive?: boolean;
  }) {
    const { ownerId, slug, ...rest } = data;
    const finalSlug = slug || this.slugify(data.name);
    return this.prisma.restaurant.create({
      data: {
        ...rest,
        slug: finalSlug,
        isActive: data.isActive ?? true,
        owner: { connect: { id: ownerId } },
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.restaurant.update({
      where: { id },
      data,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.restaurant.delete({
      where: { id },
    });
  }

  async findByOwner(ownerId: string) {
    return this.prisma.restaurant.findMany({
      where: { ownerId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }
}
