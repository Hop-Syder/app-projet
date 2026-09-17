import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeliveryStatus } from '@prisma/client';

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
} as const;

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    status?: DeliveryStatus;
    assignedTo?: string;
  }) {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.assignedTo) {
      where.assignedTo = filters.assignedTo;
    }

    return this.prisma.delivery.findMany({
      where,
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: SAFE_USER_SELECT },
              },
            },
            items: true,
            address: true,
          },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: SAFE_USER_SELECT },
              },
            },
            items: true,
            address: true,
          },
        },
        deliveryZone: true,
      },
    });

    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }

    return delivery;
  }

  async findByOrderId(orderId: string) {
    return this.prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: SAFE_USER_SELECT },
              },
            },
            address: true,
          },
        },
        deliveryZone: true,
      },
    });
  }

  async create(orderId: string, data?: {
    deliveryZoneId?: string;
    scheduledAt?: Date;
  }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { address: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return this.prisma.delivery.create({
      data: {
        orderId,
        deliveryZoneId: data?.deliveryZoneId || order.address?.deliveryZoneId,
        scheduledAt: data?.scheduledAt,
        status: DeliveryStatus.PENDING,
      },
      include: {
        order: true,
        deliveryZone: true,
      },
    });
  }

  async assignDelivery(id: string, assignedTo: string) {
    const delivery = await this.findOne(id);

    return this.prisma.delivery.update({
      where: { id },
      data: {
        assignedTo,
        status: DeliveryStatus.ASSIGNED,
      },
      include: {
        order: true,
      },
    });
  }

  async updateStatus(id: string, status: DeliveryStatus) {
    const delivery = await this.findOne(id);

    const updateData: any = { status };

    if (status === DeliveryStatus.PICKED_UP) {
      updateData.pickedUpAt = new Date();
    } else if (status === DeliveryStatus.IN_TRANSIT) {
      // Already in transit
    } else if (status === DeliveryStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
      // Also update the order status
      await this.prisma.order.update({
        where: { id: delivery.orderId },
        data: { status: 'DELIVERED', deliveredAt: new Date() },
      });
    } else if (status === DeliveryStatus.FAILED) {
      updateData.failedAt = new Date();
    }

    return this.prisma.delivery.update({
      where: { id },
      data: updateData,
      include: {
        order: true,
      },
    });
  }

  async recordAttempt(id: string, notes?: string) {
    const delivery = await this.findOne(id);

    return this.prisma.delivery.update({
      where: { id },
      data: {
        attempts: delivery.attempts + 1,
        notes: notes || delivery.notes,
      },
      include: {
        order: true,
      },
    });
  }

  async getDeliveriesForDriver(driverId: string) {
    return this.prisma.delivery.findMany({
      where: {
        assignedTo: driverId,
        status: {
          in: [DeliveryStatus.ASSIGNED, DeliveryStatus.PICKED_UP, DeliveryStatus.IN_TRANSIT],
        },
      },
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: SAFE_USER_SELECT },
              },
            },
            address: true,
            items: true,
          },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingDeliveries() {
    return this.prisma.delivery.findMany({
      where: {
        status: DeliveryStatus.PENDING,
      },
      include: {
        order: {
          include: {
            customer: {
              include: {
                user: { select: SAFE_USER_SELECT },
              },
            },
            address: true,
          },
        },
        deliveryZone: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
