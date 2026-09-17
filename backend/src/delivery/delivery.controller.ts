import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Query } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DeliveryStatus, Role } from '@prisma/client';

const STAFF = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER];
const DELIVERY_STAFF = [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.LIVREUR];

@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @Roles(...STAFF)
  findAll(
    @Query('status') status?: DeliveryStatus,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.deliveryService.findAll({ status, assignedTo });
  }

  @Get('pending')
  @Roles(...STAFF)
  getPendingDeliveries() {
    return this.deliveryService.getPendingDeliveries();
  }

  @Get('my-deliveries')
  @Roles(...DELIVERY_STAFF)
  getMyDeliveries(@Request() req: any) {
    return this.deliveryService.getDeliveriesForDriver(req.user.id);
  }

  @Get(':id')
  @Roles(...DELIVERY_STAFF)
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Get('order/:orderId')
  @Roles(...DELIVERY_STAFF)
  findByOrderId(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrderId(orderId);
  }

  @Post('order/:orderId')
  @Roles(...STAFF)
  createDelivery(@Param('orderId') orderId: string, @Body() data?: any) {
    return this.deliveryService.create(orderId, data);
  }

  @Patch(':id/assign')
  @Roles(...STAFF)
  assignDelivery(@Param('id') id: string, @Body('assignedTo') assignedTo: string) {
    return this.deliveryService.assignDelivery(id, assignedTo);
  }

  @Patch(':id/status')
  @Roles(...DELIVERY_STAFF)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.deliveryService.updateStatus(id, status);
  }

  @Post(':id/attempt')
  @Roles(...DELIVERY_STAFF)
  recordAttempt(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.deliveryService.recordAttempt(id, notes);
  }
}
