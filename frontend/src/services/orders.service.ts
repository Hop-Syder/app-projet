import { api } from './api';
import type { Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
  addressId?: string;
  deliveryZoneId?: string;
  deliveryFee?: number;
  deliverySlot?: string;
  deliveryInstructions?: string;
  paymentMethod?: string;
  notes?: string;
  discount?: number;
  items: {
    productId: string;
    quantity: number;
    weight?: number;
    cutOption?: string;
    packagingOption?: string;
    notes?: string;
  }[];
}

export const ordersService = {
  async create(data: CreateOrderPayload): Promise<Order> {
    const res = await api.post<Order>('/orders', data);
    return res.data;
  },

  async myOrders(): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders/my-orders');
    return res.data;
  },

  async findAll(filters?: { customerId?: string; status?: OrderStatus }): Promise<Order[]> {
    const res = await api.get<Order[]>('/orders', { params: filters });
    return res.data;
  },

  async findOne(id: string): Promise<Order> {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const res = await api.get<Order>(`/orders/number/${orderNumber}`);
    return res.data;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await api.patch<Order>(`/orders/${id}/status`, { status });
    return res.data;
  },

  async updateWeight(id: string, actualWeight: number, finalAmount: number) {
    const res = await api.patch(`/orders/${id}/weight`, { actualWeight, finalAmount });
    return res.data;
  },

  async cancel(id: string, reason: string): Promise<Order> {
    const res = await api.post<Order>(`/orders/${id}/cancel`, { reason });
    return res.data;
  },
};
