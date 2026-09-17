import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  initiate(@Request() req: any, @Body() data: any) {
    return this.paymentsService.initiate(req.user, data);
  }

  @Get('order/:orderId')
  findByOrder(@Request() req: any, @Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(req.user, orderId);
  }

  @Patch(':id/confirm')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  confirm(@Param('id') id: string, @Body('transactionId') transactionId?: string) {
    return this.paymentsService.confirm(id, transactionId);
  }

  @Patch(':id/fail')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  fail(@Param('id') id: string, @Body('errorMessage') errorMessage?: string) {
    return this.paymentsService.fail(id, errorMessage);
  }

  @Patch(':id/refund')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  refund(@Param('id') id: string, @Body('refundAmount') refundAmount: number) {
    return this.paymentsService.refund(id, refundAmount);
  }
}
