import { IsString, IsOptional, IsNumber, IsEnum, IsArray, ValidateNested, IsBoolean, Min, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderType {
  MEAT_ONLY = 'MEAT_ONLY',
  MEAT_WITH_SEASONING = 'MEAT_WITH_SEASONING',
  MEAT_WITH_SIDE = 'MEAT_WITH_SIDE',
  FULL_MEAL = 'FULL_MEAL',
}

export enum ConsumptionMode {
  ON_SITE = 'ON_SITE',
  TAKEAWAY = 'TAKEAWAY',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PREPARING = 'PREPARING',
  CUTTING = 'CUTTING',
  PACKAGING = 'PACKAGING',
  READY = 'READY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export class CutOptionDto {
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class SeasoningDto {
  @IsString()
  seasoningId: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class SideDto {
  @IsString()
  sideId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class ExtraDto {
  @IsString()
  extraId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DrinkDto {
  @IsString()
  drinkId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsNumber()
  @Min(0.1)
  requestedWeight?: number; // en kg

  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CutOptionDto)
  cutOption?: CutOptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SeasoningDto)
  seasoning?: SeasoningDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SideDto)
  sides?: SideDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DrinkDto)
  drinks?: DrinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExtraDto)
  extras?: ExtraDto[];
}

export class DeliveryAddressDto {
  @IsString()
  label: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class OnSiteLocationDto {
  @IsString()
  restaurantId: string;

  @IsOptional()
  @IsString()
  tableId?: string;

  @IsOptional()
  @IsString()
  spaceId?: string;

  @IsOptional()
  @IsString()
  qrCode?: string;
}

export class CreateOrderDto {
  @IsEnum(OrderType)
  orderType: OrderType;

  @IsEnum(ConsumptionMode)
  consumptionMode: ConsumptionMode;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress?: DeliveryAddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OnSiteLocationDto)
  onSiteLocation?: OnSiteLocationDto;

  @IsOptional()
  @IsString()
  deliverySlotId?: string;

  @IsOptional()
  @IsString()
  preferredDeliveryDate?: string;

  @IsOptional()
  @IsString()
  preferredDeliveryTime?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  customerNote?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  actualWeight?: number; // pour mise à jour du poids réel

  @IsOptional()
  @IsNumber()
  finalAmount?: number; // montant final recalculé
}

export class ConfirmWeightDto {
  @IsNumber()
  actualWeight: number;

  @IsNumber()
  finalAmount: number;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AssignDeliveryDto {
  @IsString()
  deliveryPersonId: string;

  @IsOptional()
  @IsString()
  estimatedDeliveryTime?: string;
}
