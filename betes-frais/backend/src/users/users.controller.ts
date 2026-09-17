import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'role', required: false, example: 'CUSTOMER' })
  @ApiQuery({ name: 'search', required: false, example: 'jean' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(parseInt(page), parseInt(limit), { role, search });
  }

  @Get('me')
  @ApiOperation({ summary: 'Récupérer mon profil' })
  async getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Désactiver un utilisateur (Admin)' })
  async deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Réactiver un utilisateur (Admin)' })
  async activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}
