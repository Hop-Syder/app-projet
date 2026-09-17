import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    productId?: string;
    status?: StockStatus;
    location?: string;
    search?: string;
  }) {
    const where: any = {};

    if (filters?.productId) {
      where.productId = filters.productId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.location) {
      where.location = filters.location;
    }

    if (filters?.search) {
      where.OR = [
        { lotNumber: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.inventoryItem.findMany({
      where,
      include: {
        product: {
          include: {
            category: true,
            animal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            category: true,
            animal: true,
          },
        },
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }

    return inventoryItem;
  }

  async create(data: {
    productId: string;
    lotNumber: string;
    quantity: number;
    initialQuantity: number;
    unit: string;
    arrivalDate: Date;
    expirationDate?: Date;
    location?: string;
    notes?: string;
  }) {
    return this.prisma.inventoryItem.create({
      data: {
        ...data,
        status: 'AVAILABLE',
        reserved: 0,
      },
      include: {
        product: true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.inventoryItem.update({
      where: { id },
      data,
      include: {
        product: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventoryItem.delete({
      where: { id },
    });
  }

  async reserve(id: string, quantity: number) {
    const item = await this.findOne(id);
    const availableQuantity = item.quantity - item.reserved;

    if (quantity > availableQuantity) {
      throw new NotFoundException(
        `Insufficient stock. Available: ${availableQuantity}, Requested: ${quantity}`,
      );
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: { reserved: item.reserved + quantity },
      include: {
        product: true,
      },
    });
  }

  async releaseReservation(id: string, quantity: number) {
    const item = await this.findOne(id);

    if (quantity > item.reserved) {
      throw new NotFoundException(
        `Cannot release more than reserved. Reserved: ${item.reserved}, Requested: ${quantity}`,
      );
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: { reserved: item.reserved - quantity },
      include: {
        product: true,
      },
    });
  }

  async adjustStock(
    id: string,
    adjustment: number,
    reason: string,
    notes?: string,
  ) {
    const item = await this.findOne(id);
    const newQuantity = item.quantity + adjustment;

    if (newQuantity < 0) {
      throw new NotFoundException('Stock cannot be negative');
    }

    return this.prisma.inventoryItem.update({
      where: { id },
      data: {
        quantity: newQuantity,
        status: adjustment < 0 ? 'ADJUSTED' : item.status,
        notes: notes || item.notes,
      },
      include: {
        product: true,
      },
    });
  }

  async getLowStockItems(threshold: number = 10) {
    return this.prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: threshold },
        status: 'AVAILABLE',
      },
      include: {
        product: true,
      },
      orderBy: { quantity: 'asc' },
    });
  }

  async getExpiredItems() {
    return this.prisma.inventoryItem.findMany({
      where: {
        expirationDate: { lt: new Date() },
        status: 'AVAILABLE',
      },
      include: {
        product: true,
      },
    });
  }

  async markAsExpired(id: string) {
    await this.findOne(id);
    return this.prisma.inventoryItem.update({
      where: { id },
      data: { status: 'EXPIRED' },
      include: {
        product: true,
      },
    });
  }
}
