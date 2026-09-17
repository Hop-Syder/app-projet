// Types principaux pour Bêtes & Frais

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  animal: Animal;
  origin: string;
  saleMode: 'fixed' | 'per_kg' | 'variable_weight' | 'live';
  basePrice: number;
  pricePerKg?: number;
  stock: number;
  images: ProductImage[];
  availability: 'available' | 'unavailable' | 'seasonal';
  packaging?: Packaging[];
  cutOptions?: CutOption[];
  storageRules?: StorageRule;
  weightOptions?: WeightOption[];
  seasonings?: Seasoning[];
  sides?: Side[];
  restaurant?: Restaurant;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface WeightOption {
  value: number; // en grammes
  label: string;
  available: boolean;
}

export interface CutOption {
  id: string;
  name: string;
  description: string;
  additionalPrice: number;
}

export interface Packaging {
  id: string;
  name: string;
  description: string;
}

export interface StorageRule {
  temperature: number;
  duration: number; // en jours
  instructions: string;
}

export interface Seasoning {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface Side {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  location: Location;
  tables?: Table[];
  openingHours: OpeningHour[];
}

export interface Table {
  id: string;
  name: string;
  qrCode: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface OpeningHour {
  day: string;
  open: string;
  close: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  estimatedTotal: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  weight?: number; // en grammes
  cutOption?: CutOption;
  seasoning?: Seasoning;
  side?: Side;
  unitPrice: number;
  totalPrice: number;
  isEstimated: boolean;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customer: Customer;
  items: OrderItem[];
  delivery?: Delivery;
  payment: Payment;
  total: number;
  finalTotal?: number;
  createdAt: Date;
  consumptionMode: 'dine_in' | 'takeaway' | 'delivery';
  table?: Table;
  restaurant?: Restaurant;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  weightRequested?: number;
  weightActual?: number;
  cutOption?: CutOption;
  seasoning?: Seasoning;
  side?: Side;
  unitPrice: number;
  totalPrice: number;
  finalPrice?: number;
}

export type OrderStatus = 
  | 'pending'
  | 'payment_confirmed'
  | 'preparing'
  | 'cutting'
  | 'packaging'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Delivery {
  id: string;
  address: Address;
  location?: Location;
  scheduledAt: Date;
  estimatedAt?: Date;
  instructions?: string;
  zone: DeliveryZone;
  fee: number;
  status: DeliveryStatus;
}

export type DeliveryStatus = 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
  minOrder: number;
  polygon?: Location[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  neighborhood?: string;
  phone: string;
  instructions?: string;
  location?: Location;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
}

export interface Payment {
  id: string;
  method: 'card' | 'mobile_money' | 'cash' | 'apple_pay';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transactionId?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

export type UserRole = 'customer' | 'preparator' | 'stock_manager' | 'order_manager' | 'delivery_driver' | 'admin' | 'super_admin';

export interface Review {
  id: string;
  orderId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  approved: boolean;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  validFrom: Date;
  validUntil: Date;
  applicableProducts?: string[];
  applicableCategories?: string[];
}
