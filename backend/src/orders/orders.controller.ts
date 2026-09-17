import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Request() req: any, @Body() data: any) {
    return this.ordersService.createOrder(req.user.id, data);
  }

  @Get()
  findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.ordersService.findAll({ customerId, status });
  }

  @Get('my-orders')
  getMyOrders(@Request() req: any) {
    return this.ordersService.getCustomerOrders(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get('number/:orderNumber')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.findByOrderNumber(orderNumber);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PREPARATEUR', 'LIVREUR')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: OrderStatus,
    @Request() req: any,
  ) {
    return this.ordersService.updateStatus(id, status, req.user.id);
  }

  @Patch(':id/weight')
  @Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PREPARATEUR')
  updateWeight(
    @Param('id') id: string,
    @Body('actualWeight') actualWeight: number,
    @Body('finalAmount') finalAmount: number,
  ) {
    return this.ordersService.updateWeight(id, actualWeight, finalAmount);
  }

  @Post(':id/cancel')
  cancelOrder(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Request() req: any,
  ) {
    return this.ordersService.cancelOrder(id, reason, req.user.id);
  }
}
