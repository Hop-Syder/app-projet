import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.addressesService.findAll(req.user.id);
  }

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.addressesService.create(req.user.id, data);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() data: any) {
    return this.addressesService.update(req.user.id, id, data);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.addressesService.remove(req.user.id, id);
  }
}
