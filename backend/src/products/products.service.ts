import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnitType } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    categoryId?: string;
    animalId?: string;
    search?: string;
    isAvailable?: boolean;
    isFeatured?: boolean;
  }) {
    const where: any = { active: true };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.animalId) {
      where.animalId = filters.animalId;
    }

    if (filters?.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        animal: true,
        images: true,
        cutOptions: true,
        packagingOptions: true,
        inventoryItems: {
          where: { status: 'AVAILABLE' },
        },
      },
      orderBy: { position: 'asc' },
    });
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
        cutOptions: true,
        packagingOptions: true,
        inventoryItems: true,
        reviews: {
          include: {
            customer: {
              include: {
                user: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        animal: true,
        images: true,
        cutOptions: true,
        packagingOptions: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    categoryId: string;
    animalId?: string;
    price: number;
    pricePerKg?: number;
    unitType: UnitType;
    minWeight?: number;
    maxWeight?: number;
    weightIncrement?: number;
    storageTemp?: number;
    storageDuration?: number;
    storageInstructions?: string;
    origin?: string;
    traceabilityCode?: string;
    nutritionInfo?: any;
    isFeatured?: boolean;
    position?: number;
  }) {
    return this.prisma.product.create({
      data: {
        ...data,
        unitType: data.unitType as UnitType,
      },
      include: {
        category: true,
        animal: true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        animal: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async addImage(productId: string, url: string, alt?: string, isPrimary?: boolean) {
    const product = await this.findOne(productId);
    
    const position = await this.prisma.productImage.count({
      where: { productId },
    });

    return this.prisma.productImage.create({
      data: {
        productId,
        url,
        alt,
        position,
        isPrimary: isPrimary || false,
      },
    });
  }

  async getFeatured(limit: number = 8) {
    return this.prisma.product.findMany({
      where: {
        active: true,
        isAvailable: true,
        isFeatured: true,
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      take: limit,
      orderBy: { position: 'asc' },
    });
  }
}
