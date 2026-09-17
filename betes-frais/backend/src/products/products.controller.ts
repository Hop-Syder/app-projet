import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dtos/product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau produit' })
  @ApiResponse({ status: 201, description: 'Produit créé avec succès' })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister tous les produits avec filtres' })
  @ApiQuery({ name: 'search', required: false, example: 'boeuf' })
  @ApiQuery({ name: 'categoryId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'animalId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'saleMode', required: false, example: 'WEIGHT' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, example: 'desc' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(@Query() queryDto: ProductQueryDto) {
    return this.productsService.findAll(queryDto);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Récupérer les produits en vedette' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  async findFeatured(@Query('limit') limit = 8) {
    return this.productsService.findFeatured(parseInt(limit as string, 10));
  }

  @Get('category/:slug')
  @Public()
  @ApiOperation({ summary: 'Récupérer les produits par catégorie' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findByCategory(
    @Param('slug') slug: string,
    @Query('limit') limit = 20,
  ) {
    return this.productsService.findByCategory(slug, parseInt(limit as string, 10));
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer un produit par son ID' })
  @ApiResponse({ status: 200, description: 'Produit trouvé' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Récupérer un produit par son slug' })
  @ApiResponse({ status: 200, description: 'Produit trouvé' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findOneBySlug(@Param('slug') slug: string) {
    return this.productsService.findOneBySlug(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un produit' })
  @ApiResponse({ status: 200, description: 'Produit mis à jour avec succès' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer/désactiver un produit' })
  @ApiResponse({ status: 200, description: 'Produit désactivé avec succès' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get(':id/availability')
  @Public()
  @ApiOperation({ summary: 'Verifier la disponibilite d un produit' })
  @ApiQuery({ name: 'quantity', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Disponibilite verifiee' })
  async checkAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity') quantity: number,
  ) {
    return this.productsService.checkAvailability(id, quantity);
  }
}
