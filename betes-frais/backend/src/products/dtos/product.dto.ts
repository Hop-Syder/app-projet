import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, ValidateNested, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum SaleMode {
  UNIT = 'unit',
  WEIGHT = 'weight',
  VARIABLE_WEIGHT = 'variable_weight',
  LIVE = 'live'
}

export enum ConservationType {
  FRESH = 'fresh',
  FROZEN = 'frozen',
  DRY = 'dry',
  REFRIGERATED = 'refrigerated'
}

export class CreateCutOptionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  additionalPrice?: number;
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  categoryId: string;

  @IsString()
  animalId: string;

  @IsEnum(SaleMode)
  saleMode: SaleMode;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  pricePerKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxWeight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCutOptionDto)
  cutOptions?: CreateCutOptionDto[];

  @IsEnum(ConservationType)
  conservationType: ConservationType;

  @IsOptional()
  @IsNumber()
  storageTemperature?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  initialStock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  nutritionalInfo?: string;

  @IsOptional()
  @IsString()
  preparationInstructions?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  animalId?: string;

  @IsOptional()
  @IsEnum(SaleMode)
  saleMode?: SaleMode;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  pricePerKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxWeight?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCutOptionDto)
  cutOptions?: CreateCutOptionDto[];

  @IsOptional()
  @IsEnum(ConservationType)
  conservationType?: ConservationType;

  @IsOptional()
  @IsNumber()
  storageTemperature?: number;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  initialStock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsString()
  nutritionalInfo?: string;

  @IsOptional()
  @IsString()
  preparationInstructions?: string;
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  animalId?: string;

  @IsOptional()
  @IsEnum(SaleMode)
  saleMode?: SaleMode;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
