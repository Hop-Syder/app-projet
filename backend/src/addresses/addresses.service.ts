import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  private async getCustomerProfileId(userId: string): Promise<string> {
    const profile = await this.prisma.customerProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Customer profile not found for this user');
    }
    return profile.id;
  }

  async findAll(userId: string) {
    const customerId = await this.getCustomerProfileId(userId);
    return this.prisma.address.findMany({
      where: { customerId },
      include: { deliveryZone: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  private async assertOwnership(userId: string, addressId: string) {
    const customerId = await this.getCustomerProfileId(userId);
    const address = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    if (address.customerId !== customerId) {
      throw new ForbiddenException('This address does not belong to you');
    }
    return { customerId, address };
  }

  async create(
    userId: string,
    data: {
      label?: string;
      street: string;
      city: string;
      district?: string;
      department: string;
      phone: string;
      instructions?: string;
      latitude?: number;
      longitude?: number;
      deliveryZoneId?: string;
      isDefault?: boolean;
    },
  ) {
    const customerId = await this.getCustomerProfileId(userId);

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: { ...data, customerId },
      include: { deliveryZone: true },
    });
  }

  async update(userId: string, id: string, data: any) {
    const { customerId } = await this.assertOwnership(userId, id);

    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data,
      include: { deliveryZone: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.assertOwnership(userId, id);
    return this.prisma.address.delete({ where: { id } });
  }
}
