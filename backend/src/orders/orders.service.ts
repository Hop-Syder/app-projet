import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(customerId: string, data: {
    addressId?: string;
    deliveryZoneId?: string;
    deliveryFee?: number;
    deliverySlot?: Date;
    deliveryInstructions?: string;
    items: {
      productId: string;
      quantity: number;
      weight?: number;
      cutOption?: string;
      packagingOption?: string;
      notes?: string;
    }[];
    discount?: number;
    tax?: number;
    paymentMethod?: string;
    notes?: string;
  }) {
    const customer = await this.prisma.customerProfile.findUnique({
      where: { id: customerId },
      include: { cart: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of data.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          cutOptions: true,
          packagingOptions: true,
        },
      });

      if (!product || !product.isAvailable) {
        throw new BadRequestException(`Product ${item.productId} is not available`);
      }

      let unitPrice = product.price;
      let pricePerKg = product.pricePerKg;

      // Apply cut option modifier
      if (item.cutOption) {
        const cutOption = product.cutOptions.find(co => co.id === item.cutOption);
        if (cutOption) {
          unitPrice += cutOption.priceModifier;
        }
      }

      // Apply packaging option modifier
      if (item.packagingOption) {
        const packagingOption = product.packagingOptions.find(po => po.id === item.packagingOption);
        if (packagingOption) {
          unitPrice += packagingOption.priceModifier;
        }
      }

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        productName: product.name,
        productSlug: product.slug,
        quantity: item.quantity,
        weight: item.weight,
        unitPrice,
        pricePerKg,
        cutOption: item.cutOption,
        packagingOption: item.packagingOption,
        subtotal: itemTotal,
        notes: item.notes,
      });
    }

    const discount = data.discount || 0;
    const tax = data.tax || 0;
    const deliveryFee = data.deliveryFee || 0;
    const totalAmount = subtotal - discount + tax + deliveryFee;

    // Generate unique order number
    const orderNumber = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        customerId,
        addressId: data.addressId,
        deliveryZoneId: data.deliveryZoneId,
        deliveryFee,
        deliverySlot: data.deliverySlot,
        deliveryInstructions: data.deliveryInstructions,
        subtotal,
        discount,
        tax,
        totalAmount,
        estimatedAmount: true, // Will be adjusted after weighing
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        customer: {
          include: {
            user: true,
          },
        },
        address: true,
      },
    });
  }

  async findAll(filters?: {
    customerId?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  }) {
    const where: any = {};

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.paymentStatus) {
      where.paymentStatus = filters.paymentStatus;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        customer: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, phone: true },
            },
          },
        },
        address: true,
        delivery: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        customer: {
          include: {
            user: true,
          },
        },
        address: true,
        delivery: true,
        payments: true,
        review: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        customer: {
          include: {
            user: true,
          },
        },
        delivery: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, userId?: string) {
    const order = await this.findOne(id);

    const updateData: any = { status };

    if (status === OrderStatus.PREPARING) {
      updateData.preparedAt = new Date();
      updateData.preparedBy = userId;
    } else if (status === OrderStatus.READY) {
      updateData.preparedAt = new Date();
    } else if (status === OrderStatus.OUT_FOR_DELIVERY) {
      updateData.deliveryAttempts = order.deliveryAttempts + 1;
    } else if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    } else if (status === OrderStatus.CANCELLED) {
      updateData.cancelledAt = new Date();
      updateData.cancelledBy = userId;
    }

    return this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: true,
        delivery: true,
      },
    });
  }

  async updateWeight(id: string, actualWeight: number, finalAmount: number) {
    const order = await this.findOne(id);

    return this.prisma.orderItem.updateMany({
      where: { orderId: id },
      data: {
        actualWeight,
        finalAmount,
      },
    });
  }

  async getCustomerOrders(customerId: string) {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
        address: true,
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async cancelOrder(id: string, reason: string, userId: string) {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel this order');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: userId,
      },
      include: {
        items: true,
        customer: true,
      },
    });
  }
}
