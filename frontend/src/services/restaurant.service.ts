import { api } from './api';
import type { Restaurant } from '../types';

export const restaurantService = {
  async getAll(): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>('/restaurants');
    return response.data;
  },

  async getById(id: string): Promise<Restaurant> {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  async create(data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.post<Restaurant>('/restaurants', data);
    return response.data;
  },

  async update(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const response = await api.patch<Restaurant>(`/restaurants/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/restaurants/${id}`);
  },

  async getByOwner(ownerId: string): Promise<Restaurant[]> {
    const response = await api.get<Restaurant[]>(`/restaurants/owner/${ownerId}`);
    return response.data;
  },
};
