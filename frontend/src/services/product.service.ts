import { api } from './api';
import type { Product } from '../types';

export const productService = {
  async getAll(params?: { categoryId?: string; restaurantId?: string; isAvailable?: boolean }): Promise<Product[]> {
    const response = await api.get<Product[]>('/products', { params });
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async create(data: Partial<Product>): Promise<Product> {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async getByRestaurant(restaurantId: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/restaurant/${restaurantId}`);
    return response.data;
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    const response = await api.get<Product[]>(`/products/category/${categoryId}`);
    return response.data;
  },
};
