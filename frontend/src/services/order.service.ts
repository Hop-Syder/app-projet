import { api } from './api';
import type { Order } from '../types';

export const orderService = {
  async getAll(params?: { status?: string }): Promise<Order[]> {
    const response = await api.get<Order[]>('/orders', { params });
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async create(data: Partial<Order>): Promise<Order> {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await api.patch<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async getByCustomer(customerId: string): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders/customer/${customerId}`);
    return response.data;
  },

  async getByRestaurant(restaurantId: string): Promise<Order[]> {
    const response = await api.get<Order[]>(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.post<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};
