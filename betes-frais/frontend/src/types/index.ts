export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryId: string;
  category?: Category;
  animalType: AnimalType;
  origin?: string;
  saleMode: 'per_kg' | 'per_unit' | 'variable_weight' | 'live';
  basePrice: number;
  pricePerKg?: number;
  currency: string;
  available: boolean;
  stockQuantity?: number;
  images: ProductImage[];
  cutOptions?: CutOption[];
  packagingOptions?: PackagingOption[];
  storageInstructions?: string;
  storageTemperature?: number;
  nutritionInfo?: NutritionInfo;
  allergens?: string[];
  preparationTime?: number; // en minutes
  minWeight?: number; // en grammes
  maxWeight?: number; // en grammes
  weightStep?: number; // en grammes
  seasoningOptions?: SeasoningOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  animalType?: AnimalType;
  imageUrl?: string;
  order: number;
  active: boolean;
}

export type AnimalType = 
  | 'beef'
  | 'sheep'
  | 'goat'
  | 'pork'
  | 'rabbit'
  | 'poultry'
  | 'fish'
  | 'other';

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  order: number;
}

export interface CutOption {
  id: string;
  name: string;
  description?: string;
  priceModifier: number; // pourcentage ou montant fixe
  modifierType: 'percentage' | 'fixed';
  available: boolean;
}

export interface PackagingOption {
  id: string;
  name: string;
  description?: string;
  priceModifier: number;
  modifierType: 'percentage' | 'fixed';
  available: boolean;
}

export interface SeasoningOption {
  id: string;
  name: string;
  description?: string;
  price: number;
  spicyLevel?: 'mild' | 'medium' | 'hot' | 'very_hot';
  available: boolean;
}

export interface Accompaniment {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'rice' | 'pasta' | 'potato' | 'vegetables' | 'other';
  available: boolean;
}

export interface Beverage {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'water' | 'soda' | 'juice' | 'beer' | 'wine' | 'other';
  volume?: number; // en ml
  available: boolean;
}

export interface Extra {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'sauce' | 'condiment' | 'side' | 'other';
  available: boolean;
}

export interface NutritionInfo {
  calories?: number; // pour 100g
  protein?: number; // en grammes
  fat?: number; // en grammes
  carbohydrates?: number; // en grammes
  salt?: number; // en grammes
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: Address;
  phone: string;
  email?: string;
  images: RestaurantImage[];
  openingHours: OpeningHour[];
  tables?: Table[];
  consumptionModes: ConsumptionMode[];
  rating?: number;
  reviewCount?: number;
  active: boolean;
}

export interface RestaurantImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface OpeningHour {
  dayOfWeek: number; // 0 = dimanche, 6 = samedi
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  isClosed: boolean;
}

export interface Table {
  id: string;
  name: string;
  qrCode?: string;
  capacity?: number;
  available: boolean;
}

export type ConsumptionMode = 'delivery' | 'pickup' | 'dine_in';

export interface Address {
  id?: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
  isDefault?: boolean;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  fee: number;
  freeAboveAmount: number;
  minOrderAmount: number;
  polygon?: GeoJSON.Polygon;
  active: boolean;
}

export interface DeliverySlot {
  id: string;
  date: Date;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  maxOrders: number;
  currentOrders: number;
  available: boolean;
}
