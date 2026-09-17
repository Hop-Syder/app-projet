import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, ConfirmWeightDto, AssignDeliveryDto, OrderStatus } from './dto';
import { OrderType, ConsumptionMode } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { orderType, consumptionMode, items, deliveryAddress, onSiteLocation, deliverySlotId, preferredDeliveryDate, preferredDeliveryTime, couponCode, paymentMethod, customerNote } = createOrderDto;

    // Validation selon le mode de consommation
    if (consumptionMode === ConsumptionMode.DELIVERY && !deliveryAddress) {
      throw new BadRequestException('Une adresse de livraison est requise pour une commande en livraison.');
    }

    if (consumptionMode === ConsumptionMode.ON_SITE && !onSiteLocation) {
      throw new BadRequestException('Un emplacement sur place (restaurant/table) est requis pour une consommation sur place.');
    }

    // Vérification des produits et calcul du montant estimatif
    let estimatedTotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { cutOptions: true },
      });

      if (!product || !product.isAvailable) {
        throw new NotFoundException(`Le produit ${item.productId} n'est pas disponible.`);
      }

      // Vérification du stock
      const currentStock = await this.prisma.inventoryItem.aggregate({
        where: { productId: item.productId, status: 'AVAILABLE' },
        _sum: { quantity: true },
      });
      
      const requestedQty = item.requestedWeight || item.quantity || 1;
      if (currentStock._sum.quantity && currentStock._sum.quantity < requestedQty) {
        throw new BadRequestException(`Stock insuffisant pour le produit ${product.name}.`);
      }

      // Calcul du prix estimatif
      let itemPrice = 0;
      if (product.pricePerKg && item.requestedWeight) {
        itemPrice = Number(product.pricePerKg) * item.requestedWeight;
      } else if (product.price && item.quantity) {
        itemPrice = Number(product.price) * (item.quantity || 1);
      }

      // Ajout des options (assaisonnement, accompagnements, etc.)
      // TODO: Implémenter la logique de prix pour les options

      estimatedTotal += itemPrice;

      orderItemsData.push({
        productId: item.productId,
        requestedWeight: item.requestedWeight,
        quantity: item.quantity || 1,
        cutOption: item.cutOption ? JSON.stringify(item.cutOption) : null,
        seasoning: item.seasoning ? JSON.stringify(item.seasoning) : null,
        sides: item.sides ? JSON.stringify(item.sides) : null,
        drinks: item.drinks ? JSON.stringify(item.drinks) : null,
        extras: item.extras ? JSON.stringify(item.extras) : null,
        estimatedPrice: itemPrice,
      });
    }

    // Gestion des frais de livraison si applicable
    let deliveryFee = 0;
    if (consumptionMode === ConsumptionMode.DELIVERY && deliveryAddress) {
      // TODO: Calculer les frais de livraison selon la zone
      deliveryFee = 0; // Valeur par défaut à remplacer
    }

    const totalAmount = estimatedTotal + deliveryFee;

    // Création de la commande
    const order = await this.prisma.order.create({
      data: {
        customerId: userId,
        orderType,
        consumptionMode,
        status: OrderStatus.PENDING,
        estimatedAmount: estimatedTotal,
        deliveryFee,
        totalAmount,
        currency: 'XOF', // Franc CFA
        paymentMethod: paymentMethod || 'PENDING',
        paymentStatus: 'PENDING',
        customerNote,
        couponCode,
        deliveryAddress: deliveryAddress ? JSON.stringify(deliveryAddress) : null,
        onSiteLocation: onSiteLocation ? JSON.stringify(onSiteLocation) : null,
        preferredDeliveryDate: preferredDeliveryDate ? new Date(preferredDeliveryDate) : null,
        preferredDeliveryTime,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Commande créée: ${order.id} par le client ${userId}`);
    return order;
  }

  async findAll(query: { status?: OrderStatus; consumptionMode?: ConsumptionMode; page?: number; limit?: number }) {
    const { status, consumptionMode, page = 1, limit = 20 } = query;

    const where: any = {};
    if (status) where.status = status;
    if (consumptionMode) where.consumptionMode = consumptionMode;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
          customer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          deliveryPerson: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                thumbnailUrl: true,
                pricePerKg: true,
                price: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payments: true,
        delivery: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} non trouvée.`);
    }

    return order;
  }

  async findByCustomer(customerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  thumbnailUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where: { customerId } }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto, adminId?: string) {
    const { status, note, actualWeight, finalAmount } = updateOrderStatusDto;

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} non trouvée.`);
    }

    // Mise à jour du statut
    const updateData: any = {
      status,
      statusHistory: {
        create: {
          status,
          note,
          performedBy: adminId || 'system',
        },
      },
    };

    // Si le poids réel est fourni, mettre à jour le montant final
    if (actualWeight !== undefined && finalAmount !== undefined) {
      updateData.actualWeight = actualWeight;
      updateData.finalAmount = finalAmount;
      updateData.totalAmount = finalAmount + (order.deliveryFee || 0);
    }

    if (note) {
      updateData.internalNote = note;
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Commande ${id} mise à jour: statut ${status}`);
    return updatedOrder;
  }

  async confirmWeight(id: string, confirmWeightDto: ConfirmWeightDto, adminId: string) {
    const { actualWeight, finalAmount, note } = confirmWeightDto;

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} non trouvée.`);
    }

    // Vérification de la tolérance de poids
    // TODO: Implémenter la logique de tolérance selon les règles métier

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        actualWeight,
        finalAmount,
        totalAmount: finalAmount + (order.deliveryFee || 0),
        status: OrderStatus.READY,
        statusHistory: {
          create: {
            status: OrderStatus.READY,
            note: note || `Poids réel confirmé: ${actualWeight}kg, Montant final: ${finalAmount} XOF`,
            performedBy: adminId,
          },
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Poids confirmé pour la commande ${id}: ${actualWeight}kg, ${finalAmount} XOF`);
    return updatedOrder;
  }

  async assignDelivery(id: string, assignDeliveryDto: AssignDeliveryDto, adminId: string) {
    const { deliveryPersonId, estimatedDeliveryTime } = assignDeliveryDto;

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} non trouvée.`);
    }

    if (order.consumptionMode !== ConsumptionMode.DELIVERY) {
      throw new BadRequestException('Cette commande n\'est pas en mode livraison.');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        deliveryPersonId,
        status: OrderStatus.OUT_FOR_DELIVERY,
        statusHistory: {
          create: {
            status: OrderStatus.OUT_FOR_DELIVERY,
            note: `Livraison assignée au livreur ${deliveryPersonId}`,
            performedBy: adminId,
          },
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        deliveryPerson: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    // Créer l'entrée de livraison
    await this.prisma.delivery.create({
      data: {
        orderId: id,
        deliveryPersonId,
        status: 'ASSIGNED',
        estimatedDeliveryTime: estimatedDeliveryTime ? new Date(estimatedDeliveryTime) : null,
      },
    });

    this.logger.log(`Livraison assignée pour la commande ${id} au livreur ${deliveryPersonId}`);
    return updatedOrder;
  }

  async cancel(id: string, reason: string, adminId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Commande ${id} non trouvée.`);
    }

    if ([OrderStatus.DELIVERED, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Cette commande ne peut plus être annulée.');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        cancellationReason: reason,
        cancelledAt: new Date(),
        statusHistory: {
          create: {
            status: OrderStatus.CANCELLED,
            note: reason,
            performedBy: adminId || 'system',
          },
        },
      },
      include: {
        items: true,
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    this.logger.log(`Commande ${id} annulée: ${reason}`);
    return updatedOrder;
  }

  async getStatistics(dateFrom?: Date, dateTo?: Date) {
    const where: any = {};
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = dateFrom;
      if (dateTo) where.createdAt.lte = dateTo;
    }

    const [totalOrders, totalRevenue, pendingOrders, deliveredOrders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.aggregate({
        where,
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.PENDING } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.DELIVERED } }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      deliveredOrders,
      averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0,
    };
  }
}
