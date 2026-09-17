import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeliveryZonesService {
  constructor(private prisma: PrismaService) {}

  async findAll(activeOnly = true) {
    return this.prisma.deliveryZone.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const zone = await this.prisma.deliveryZone.findUnique({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Delivery zone ${id} not found`);
    }
    return zone;
  }

  async create(data: {
    name: string;
    description?: string;
    fee: number;
    minOrder?: number;
    cities: string[];
    districts?: string[];
    active?: boolean;
  }) {
    return this.prisma.deliveryZone.create({ data });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.deliveryZone.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.deliveryZone.delete({ where: { id } });
  }
}
