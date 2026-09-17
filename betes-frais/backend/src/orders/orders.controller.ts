import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, ConfirmWeightDto, AssignDeliveryDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { OrderStatus, ConsumptionMode } from './dto/create-order.dto';

@ApiTags('orders')
@Controller('orders')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle commande' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, createOrderDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Récupérer toutes les commandes (Admin)' })
  @ApiResponse({ status: 200, description: 'Liste des commandes.' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'consumptionMode', required: false, enum: ConsumptionMode })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    const parsedQuery = {
      status: query.status,
      consumptionMode: query.consumptionMode,
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 20,
    };
    return this.ordersService.findAll(parsedQuery);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Récupérer mes commandes (Client)' })
  @ApiResponse({ status: 200, description: 'Liste des commandes du client.' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findMyOrders(@Request() req, @Query('page') page = '1', @Query('limit') limit = '20') {
    return this.ordersService.findByCustomer(
      req.user.userId,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une commande par son ID' })
  @ApiResponse({ status: 200, description: 'Détails de la commande.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande (Admin)' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto, req.user.userId);
  }

  @Post(':id/confirm-weight')
  @Roles(Role.ADMIN, Role.MANAGER, Role.PREPARER)
  @ApiOperation({ summary: 'Confirmer le poids réel d\'une commande (Admin/Préparateur)' })
  @ApiResponse({ status: 200, description: 'Poids confirmé.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  confirmWeight(
    @Param('id') id: string,
    @Body() confirmWeightDto: ConfirmWeightDto,
    @Request() req,
  ) {
    return this.ordersService.confirmWeight(id, confirmWeightDto, req.user.userId);
  }

  @Post(':id/assign-delivery')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Assigner un livreur à une commande (Admin)' })
  @ApiResponse({ status: 200, description: 'Livreur assigné.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  assignDelivery(
    @Param('id') id: string,
    @Body() assignDeliveryDto: AssignDeliveryDto,
    @Request() req,
  ) {
    return this.ordersService.assignDelivery(id, assignDeliveryDto, req.user.userId);
  }

  @Post(':id/cancel')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Annuler une commande (Admin)' })
  @ApiResponse({ status: 200, description: 'Commande annulée.' })
  @ApiResponse({ status: 400, description: 'La commande ne peut pas être annulée.' })
  cancel(@Param('id') id: string, @Body('reason') reason: string, @Request() req) {
    if (!reason) {
      throw new BadRequestException('Le motif d\'annulation est requis.');
    }
    return this.ordersService.cancel(id, reason, req.user.userId);
  }

  @Get('statistics')
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Récupérer les statistiques des commandes (Admin)' })
  @ApiResponse({ status: 200, description: 'Statistiques des commandes.' })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  getStatistics(
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.ordersService.getStatistics(
      dateFrom ? new Date(dateFrom) : undefined,
      dateTo ? new Date(dateTo) : undefined,
    );
  }
}
