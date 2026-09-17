export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_DRIVER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  defaultAddress?: string | null;
  loyaltyPoints: number;
  user?: User;
}

export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string | null;
  address: string;
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
  openingHours?: Record<string, any> | null;
  owner?: User;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  products?: Product[];
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  isAvailable: boolean;
  isFeatured: boolean;
  preparationTime?: number | null;
  calories?: number | null;
  allergens?: string[] | null;
  ingredients?: string[] | null;
  imageUrl?: string | null;
  unitType?: 'PIECE' | 'WEIGHT' | 'VOLUME' | null;
  unitValue?: number | null;
  stockQuantity?: number | null;
  restaurant?: Restaurant;
  category?: Category;
  orderItems?: OrderItem[];
}

export interface CartItem {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  specialInstructions?: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  deliveryInstructions?: string | null;
  estimatedDeliveryTime?: string | null;
  actualDeliveryTime?: string | null;
  customer?: User;
  restaurant?: Restaurant;
  items?: OrderItem[];
  delivery?: Delivery;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string | null;
  product?: Product;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId?: string | null;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  pickupLocation: string;
  deliveryLocation: string;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  distance?: number | null;
  order?: Order;
  driver?: User;
}

export interface Inventory {
  id: string;
  productId: string;
  quantity: number;
  lowStockThreshold: number;
  lastRestockedAt?: string | null;
  product?: Product;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'DELIVERY_DRIVER';
}
