import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/profile')
  getCustomerProfile(@Request() req: any) {
    return this.usersService.getCustomerProfile(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
