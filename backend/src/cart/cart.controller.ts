import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Request() req: any, @Body() data: any) {
    return this.cartService.addItem(req.user.id, data);
  }

  @Patch('items/:itemId')
  updateItem(@Request() req: any, @Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    return this.cartService.updateItem(req.user.id, itemId, quantity);
  }

  @Delete('items/:itemId')
  removeItem(@Request() req: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(req.user.id, itemId);
  }

  @Delete()
  clear(@Request() req: any) {
    return this.cartService.clear(req.user.id);
  }
}
