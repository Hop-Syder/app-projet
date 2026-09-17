import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(
    @Query('productId') productId?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('approvedOnly') approvedOnly?: string,
  ) {
    return this.reviewsService.findAll({
      productId,
      restaurantId,
      approvedOnly: approvedOnly !== 'false',
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() data: any) {
    return this.reviewsService.create(req.user.id, data);
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  approve(@Param('id') id: string) {
    return this.reviewsService.approve(id);
  }

  @Patch(':id/response')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  respond(@Param('id') id: string, @Body('response') response: string) {
    return this.reviewsService.respond(id, response);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
