import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        customerProfile: {
          include: {
            addresses: true,
            orders: {
              take: 5,
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        customerProfile: {
          include: {
            addresses: true,
            orders: true,
            favorites: {
              include: {
                product: true,
              },
            },
            reviews: true,
          },
        },
        auditLogs: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password, ...result } = user;
    return result;
  }

  async updateRole(id: string, role: Role) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getCustomerProfile(userId: string) {
    const profile = await this.prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        addresses: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
                cutOption: true,
                packagingOption: true,
              },
            },
          },
        },
        favorites: {
          include: {
            product: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(`Customer profile for user ${userId} not found`);
    }

    return profile;
  }
}
