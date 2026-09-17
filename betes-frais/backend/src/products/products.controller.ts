import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Public } from '../decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Lister tous les produits avec filtres' })
  @ApiQuery({ name: 'search', required: false, example: 'boeuf' })
  @ApiQuery({ name: 'categoryId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'animalId', required: false, example: 'uuid' })
  @ApiQuery({ name: 'saleMode', required: false, example: 'PER_KG' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findAll(@Query() filters: any) {
    return this.productsService.findAll(filters);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Récupérer les produits en vedette' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 8 })
  async findFeatured(@Query('limit') limit = 8) {
    return this.productsService.findFeatured(parseInt(limit as string));
  }

  @Get('category/:slug')
  @Public()
  @ApiOperation({ summary: 'Récupérer les produits par catégorie' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  async findByCategory(@Param('slug') slug: string, @Query('limit') limit = 20) {
    return this.productsService.findByCategory(slug, parseInt(limit as string));
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Récupérer un produit par son slug' })
  @ApiResponse({ status: 200, description: 'Produit trouvé' })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  async findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }
}
