import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
      lowStockItems,
      expiredItems,
      recentOrders,
      revenueAgg,
      ordersByStatusRaw,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.count({
        where: { status: { in: [OrderStatus.PREPARING, OrderStatus.CUTTING, OrderStatus.PACKAGING] } },
      }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.customerProfile.count(),
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.inventoryItem.count({ where: { status: 'AVAILABLE', quantity: { lte: 10 } } }),
      this.prisma.inventoryItem.count({ where: { expirationDate: { lt: new Date() }, status: 'AVAILABLE' } }),
      this.prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { include: { user: { select: { firstName: true, lastName: true } } } },
          items: true,
        },
      }),
      this.prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: OrderStatus.CANCELLED }, paymentStatus: 'COMPLETED' },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    const ordersByStatus = ordersByStatusRaw.reduce((acc: Record<string, number>, row: any) => {
      acc[row.status] = row._count._all;
      return acc;
    }, {});

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      deliveredOrders,
      totalCustomers,
      totalProducts,
      lowStockItems,
      expiredItems,
      totalRevenue: revenueAgg._sum.totalAmount ?? 0,
      ordersByStatus,
      recentOrders,
    };
  }
}
