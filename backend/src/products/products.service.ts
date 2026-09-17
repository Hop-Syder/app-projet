import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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
    cutOptions?: { name: string; priceModifier?: number }[];
    packagingOptions?: { name: string; priceModifier?: number }[];
  }) {
    const { cutOptions, packagingOptions, ...productData } = data;
    try {
      return await this.prisma.product.create({
        data: {
          ...productData,
          unitType: data.unitType as UnitType,
          cutOptions: cutOptions?.length
            ? { create: cutOptions.filter((o) => o.name).map((o) => ({ name: o.name, priceModifier: o.priceModifier || 0 })) }
            : undefined,
          packagingOptions: packagingOptions?.length
            ? {
                create: packagingOptions
                  .filter((o) => o.name)
                  .map((o) => ({ name: o.name, priceModifier: o.priceModifier || 0 })),
              }
            : undefined,
        },
        include: {
          category: true,
          animal: true,
          cutOptions: true,
          packagingOptions: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('A product with this slug already exists');
      }
      throw err;
    }
  }

  async update(
    id: string,
    data: any & {
      cutOptions?: { name: string; priceModifier?: number }[];
      packagingOptions?: { name: string; priceModifier?: number }[];
    },
  ) {
    await this.findOne(id);
    const { cutOptions, packagingOptions, ...productData } = data;

    return this.prisma.$transaction(async (tx) => {
      if (cutOptions) {
        await tx.cutOption.deleteMany({ where: { productId: id } });
        if (cutOptions.length) {
          await tx.cutOption.createMany({
            data: cutOptions.filter((o) => o.name).map((o) => ({ productId: id, name: o.name, priceModifier: o.priceModifier || 0 })),
          });
        }
      }
      if (packagingOptions) {
        await tx.packagingOption.deleteMany({ where: { productId: id } });
        if (packagingOptions.length) {
          await tx.packagingOption.createMany({
            data: packagingOptions
              .filter((o) => o.name)
              .map((o) => ({ productId: id, name: o.name, priceModifier: o.priceModifier || 0 })),
          });
        }
      }

      return tx.product.update({
        where: { id },
        data: productData,
        include: {
          category: true,
          animal: true,
          cutOptions: true,
          packagingOptions: true,
        },
      });
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
