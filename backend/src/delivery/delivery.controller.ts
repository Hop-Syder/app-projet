import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DeliveryStatus } from '@prisma/client';

@Controller('delivery')
@UseGuards(JwtAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  findAll(
    @Query('status') status?: DeliveryStatus,
    @Query('assignedTo') assignedTo?: string,
  ) {
    return this.deliveryService.findAll({ status, assignedTo });
  }

  @Get('pending')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  getPendingDeliveries() {
    return this.deliveryService.getPendingDeliveries();
  }

  @Get('my-deliveries')
  getMyDeliveries(@Request() req: any) {
    return this.deliveryService.getDeliveriesForDriver(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId') orderId: string) {
    return this.deliveryService.findByOrderId(orderId);
  }

  @Post('order/:orderId')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  createDelivery(@Param('orderId') orderId: string, @Body() data?: any) {
    return this.deliveryService.create(orderId, data);
  }

  @Patch(':id/assign')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
  assignDelivery(@Param('id') id: string, @Body('assignedTo') assignedTo: string) {
    return this.deliveryService.assignDelivery(id, assignedTo);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'LIVREUR')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeliveryStatus,
  ) {
    return this.deliveryService.updateStatus(id, status);
  }

  @Post(':id/attempt')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'LIVREUR')
  recordAttempt(
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.deliveryService.recordAttempt(id, notes);
  }
}
