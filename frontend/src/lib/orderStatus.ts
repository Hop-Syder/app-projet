import type { OrderStatus } from '../types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  CUTTING: 'Découpe en cours',
  PACKAGING: 'Conditionnement',
  READY: 'Prête',
  OUT_FOR_DELIVERY: 'En livraison',
  DELIVERED: 'Livrée',
  FAILED: 'Échec',
  CANCELLED: 'Annulée',
  REFUNDED: 'Remboursée',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-blue-100 text-blue-800',
  CUTTING: 'bg-blue-100 text-blue-800',
  PACKAGING: 'bg-blue-100 text-blue-800',
  READY: 'bg-primary-soft text-primary-dark',
  OUT_FOR_DELIVERY: 'bg-accent/20 text-accent',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-danger-soft text-danger',
  CANCELLED: 'bg-gray-200 text-gray-700',
  REFUNDED: 'bg-gray-200 text-gray-700',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'CUTTING',
  'PACKAGING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];
