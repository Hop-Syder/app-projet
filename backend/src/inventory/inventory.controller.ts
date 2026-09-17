import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  findAll(
    @Query('productId') productId?: string,
    @Query('status') status?: any,
    @Query('location') location?: string,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.findAll({
      productId,
      status,
      location,
      search,
    });
  }

  @Get('low-stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  getLowStockItems(@Query('threshold') threshold?: string) {
    return this.inventoryService.getLowStockItems(
      threshold ? parseInt(threshold) : 10,
    );
  }

  @Get('expired')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  getExpiredItems() {
    return this.inventoryService.getExpiredItems();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  create(@Body() data: any) {
    return this.inventoryService.create(data);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() data: any) {
    return this.inventoryService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Post(':id/reserve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  reserve(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.reserve(id, quantity);
  }

  @Post(':id/release')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  releaseReservation(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.inventoryService.releaseReservation(id, quantity);
  }

  @Post(':id/adjust')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  adjustStock(
    @Param('id') id: string,
    @Body('adjustment') adjustment: number,
    @Body('reason') reason: string,
    @Body('notes') notes?: string,
  ) {
    return this.inventoryService.adjustStock(id, adjustment, reason, notes);
  }

  @Post(':id/expired')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  markAsExpired(@Param('id') id: string) {
    return this.inventoryService.markAsExpired(id);
  }
}
