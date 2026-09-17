import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private cartInclude = {
    items: {
      include: {
        product: {
          include: {
            images: { where: { isPrimary: true }, take: 1 },
          },
        },
        cutOption: true,
        packagingOption: true,
      },
      orderBy: { createdAt: 'asc' as const },
    },
  };

  private async getOrCreateCart(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Customer profile not found for this user');
    }

    let cart = await this.prisma.cart.findUnique({
      where: { customerId: profile.id },
      include: this.cartInclude,
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { customerId: profile.id },
        include: this.cartInclude,
      });
    }

    return cart;
  }

  private async recalculate(cartId: string) {
    const items = await this.prisma.cartItem.findMany({ where: { cartId } });
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    return this.prisma.cart.update({
      where: { id: cartId },
      data: { totalAmount },
      include: this.cartInclude,
    });
  }

  async getCart(userId: string) {
    return this.getOrCreateCart(userId);
  }

  async addItem(
    userId: string,
    data: {
      productId: string;
      quantity: number;
      weight?: number;
      cutOptionId?: string;
      packagingOptionId?: string;
    },
  ) {
    if (!data.productId || !data.quantity || data.quantity <= 0) {
      throw new BadRequestException('productId and a positive quantity are required');
    }

    const cart = await this.getOrCreateCart(userId);

    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
      include: { cutOptions: true, packagingOptions: true },
    });

    if (!product || !product.active) {
      throw new NotFoundException('Product not found');
    }
    if (!product.isAvailable) {
      throw new BadRequestException('Product is not available');
    }

    let unitPrice = product.price;

    if (data.cutOptionId) {
      const cutOption = product.cutOptions.find((c) => c.id === data.cutOptionId);
      if (!cutOption) {
        throw new BadRequestException('Invalid cut option for this product');
      }
      unitPrice += cutOption.priceModifier;
    }

    if (data.packagingOptionId) {
      const packagingOption = product.packagingOptions.find((p) => p.id === data.packagingOptionId);
      if (!packagingOption) {
        throw new BadRequestException('Invalid packaging option for this product');
      }
      unitPrice += packagingOption.priceModifier;
    }

    const totalPrice = unitPrice * data.quantity;

    // findUnique cannot compare null within a compound key, so an existing
    // identical line (same product + options) is located with findFirst instead.
    const existing = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
        cutOptionId: data.cutOptionId ?? null,
        packagingOptionId: data.packagingOptionId ?? null,
      },
    });

    if (existing) {
      const quantity = existing.quantity + data.quantity;
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity, totalPrice: unitPrice * quantity, unitPrice, weight: data.weight },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          quantity: data.quantity,
          weight: data.weight,
          cutOptionId: data.cutOptionId,
          packagingOptionId: data.packagingOptionId,
          unitPrice,
          totalPrice,
        },
      });
    }

    return this.recalculate(cart.id);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be positive; use remove to delete an item');
    }

    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity, totalPrice: item.unitPrice * quantity },
    });

    return this.recalculate(cart.id);
  }

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    return this.recalculate(cart.id);
  }

  async clear(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.recalculate(cart.id);
  }
}
