import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiate(
    requester: { id: string; role: string },
    data: { orderId: string; method: 'CASH' | 'MOBILE_MONEY' | 'CARD'; provider?: string },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
      include: { customer: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customer.userId !== requester.id && !STAFF_ROLES.includes(requester.role)) {
      throw new ForbiddenException('You do not have access to this order');
    }
    if (order.paymentStatus === PaymentStatus.COMPLETED) {
      throw new BadRequestException('This order is already paid');
    }

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        method: data.method,
        provider: data.provider,
        status: data.method === 'CASH' ? PaymentStatus.PENDING : PaymentStatus.PROCESSING,
      },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { paymentMethod: data.method, paymentStatus: payment.status },
    });

    return payment;
  }

  // Manual confirmation until a real Mobile Money / card gateway is wired up.
  // RB-01/RB-13: the backend remains the only source of truth for payment state.
  async confirm(paymentId: string, transactionId?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.COMPLETED,
        transactionId,
        paidAt: new Date(),
      },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: PaymentStatus.COMPLETED, paidAt: new Date() },
    });

    return updated;
  }

  async fail(paymentId: string, errorMessage?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.FAILED, errorMessage },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
    });

    return updated;
  }

  async refund(paymentId: string, refundAmount: number) {
    const payment = await this.prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    const status = refundAmount >= payment.amount ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status, refundAmount, refundedAt: new Date() },
    });

    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: status },
    });

    return updated;
  }

  async findByOrder(requester: { id: string; role: string }, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.customer.userId !== requester.id && !STAFF_ROLES.includes(requester.role)) {
      throw new ForbiddenException('You do not have access to this order');
    }
    return this.prisma.payment.findMany({ where: { orderId }, orderBy: { createdAt: 'desc' } });
  }
}
