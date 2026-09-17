// Types alignés sur backend/prisma/schema.prisma — Bêtes & Frais

export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'PREPARATEUR'
  | 'LIVREUR'
  | 'CUSTOMER'
  | 'RESTAURANT_OWNER';

export const STAFF_ROLES: Role[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER'];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse extends User {
  access_token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export type UnitType = 'KG' | 'PIECE' | 'LOT';
export type StockStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'EXPIRED' | 'LOST' | 'ADJUSTED';
export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'CUTTING'
  | 'PACKAGING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
export type DeliveryStatus = 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';

export interface Animal {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  imageUrl?: string | null;
  position: number;
  active: boolean;
  products?: Product[];
}

export interface CutOption {
  id: string;
  productId: string;
  name: string;
  description?: string | null;
  priceModifier: number;
  active: boolean;
}

export interface PackagingOption {
  id: string;
  productId: string;
  name: string;
  description?: string | null;
  priceModifier: number;
  active: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string | null;
  position: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  category?: Category;
  animalId?: string | null;
  animal?: Animal | null;
  restaurantId?: string | null;
  price: number;
  pricePerKg?: number | null;
  currency: string;
  unitType: UnitType;
  minWeight?: number | null;
  maxWeight?: number | null;
  weightIncrement?: number | null;
  cutOptions: CutOption[];
  packagingOptions: PackagingOption[];
  storageTemp?: number | null;
  storageDuration?: number | null;
  storageInstructions?: string | null;
  isAvailable: boolean;
  stockQuantity?: number | null;
  lowStockThreshold: number;
  images: ProductImage[];
  origin?: string | null;
  traceabilityCode?: string | null;
  regulatoryInfo?: string | null;
  active: boolean;
  isFeatured: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  description?: string | null;
  fee: number;
  minOrder: number;
  active: boolean;
  cities: string[];
  districts: string[];
}

export interface Address {
  id: string;
  customerId: string;
  label?: string | null;
  street: string;
  city: string;
  district?: string | null;
  department: string;
  country: string;
  phone: string;
  instructions?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
  deliveryZoneId?: string | null;
  deliveryZone?: DeliveryZone | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  quantity: number;
  weight?: number | null;
  cutOptionId?: string | null;
  cutOption?: CutOption | null;
  packagingOptionId?: string | null;
  packagingOption?: PackagingOption | null;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  weight?: number | null;
  actualWeight?: number | null;
  unitPrice: number;
  pricePerKg?: number | null;
  cutOption?: string | null;
  packagingOption?: string | null;
  subtotal: number;
  finalAmount?: number | null;
  notes?: string | null;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  provider?: string | null;
  transactionId?: string | null;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  deliveryZoneId?: string | null;
  deliveryZone?: DeliveryZone | null;
  assignedTo?: string | null;
  status: DeliveryStatus;
  scheduledAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  attempts: number;
  notes?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: { id: string; userId: string; user?: Partial<User> };
  addressId?: string | null;
  address?: Address | null;
  deliveryZoneId?: string | null;
  deliveryFee: number;
  deliverySlot?: string | null;
  deliveryInstructions?: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  estimatedAmount: boolean;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  actualWeight?: number | null;
  weightTolerance: number;
  items: OrderItem[];
  payments?: Payment[];
  delivery?: Delivery | null;
  notes?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  owner?: Partial<User>;
  name: string;
  slug: string;
  description?: string | null;
  address: string;
  city?: string | null;
  department?: string | null;
  phone?: string | null;
  email?: string | null;
  cuisineType?: string | null;
  priceRange?: string | null;
  deliveryRadius?: number | null;
  minimumOrder?: number | null;
  preparationTime?: number | null;
  isActive: boolean;
  rating?: number | null;
  totalReviews: number;
  imageUrl?: string | null;
  openingHours?: Record<string, unknown> | null;
}

export interface InventoryItem {
  id: string;
  productId: string;
  product?: Product;
  lotNumber: string;
  quantity: number;
  reserved: number;
  initialQuantity: number;
  unit: string;
  arrivalDate: string;
  expirationDate?: string | null;
  status: StockStatus;
  location?: string | null;
  notes?: string | null;
}

export interface Review {
  id: string;
  customerId: string;
  customer?: { user?: { firstName: string; lastName: string } };
  orderId?: string | null;
  productId?: string | null;
  restaurantId?: string | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  approved: boolean;
  response?: string | null;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface AdminDashboard {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: number;
  expiredItems: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: Order[];
}
