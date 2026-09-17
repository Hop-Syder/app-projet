import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async validate(code: string, orderAmount: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.active) {
      throw new NotFoundException('Invalid or inactive coupon code');
    }
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      throw new BadRequestException('This coupon is not currently valid');
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon has reached its usage limit');
    }
    if (orderAmount < coupon.minOrder) {
      throw new BadRequestException(`Minimum order amount for this coupon is ${coupon.minOrder}`);
    }

    let discount =
      coupon.discountType === 'PERCENTAGE' ? (orderAmount * coupon.discountValue) / 100 : coupon.discountValue;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }

    return { coupon, discount };
  }

  async create(data: {
    code: string;
    description?: string;
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
    minOrder?: number;
    maxDiscount?: number;
    usageLimit?: number;
    validFrom: Date;
    validUntil: Date;
    applicableCategories?: string[];
    applicableProducts?: string[];
  }) {
    return this.prisma.coupon.create({ data: { ...data, code: data.code.toUpperCase() } });
  }

  async update(id: string, data: any) {
    await this.assertExists(id);
    return this.prisma.coupon.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  private async assertExists(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon ${id} not found`);
    }
    return coupon;
  }
}
