import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: { productId?: string; restaurantId?: string; approvedOnly?: boolean }) {
    const where: any = {};
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.restaurantId) where.restaurantId = filters.restaurantId;
    if (filters?.approvedOnly) where.approved = true;

    return this.prisma.review.findMany({
      where,
      include: {
        customer: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(
    userId: string,
    data: { orderId?: string; productId?: string; restaurantId?: string; rating: number; title?: string; comment?: string },
  ) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    if (!data.productId && !data.restaurantId) {
      throw new BadRequestException('A review must target a product or a restaurant');
    }

    const profile = await this.prisma.customerProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Customer profile not found');
    }

    if (data.orderId) {
      const order = await this.prisma.order.findUnique({ where: { id: data.orderId } });
      if (!order || order.customerId !== profile.id) {
        throw new ForbiddenException('You can only review your own orders');
      }
    }

    return this.prisma.review.create({
      data: { ...data, customerId: profile.id, approved: false },
    });
  }

  async approve(id: string) {
    await this.assertExists(id);
    return this.prisma.review.update({ where: { id }, data: { approved: true } });
  }

  async respond(id: string, response: string) {
    await this.assertExists(id);
    return this.prisma.review.update({ where: { id }, data: { response, respondedAt: new Date() } });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.review.delete({ where: { id } });
  }

  private async assertExists(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review ${id} not found`);
    }
    return review;
  }
}
