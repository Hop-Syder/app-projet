import { api } from './api';
import type { Restaurant } from '../types';

export const restaurantsService = {
  async findAll(filters?: { cuisineType?: string; priceRange?: string; search?: string; isActive?: boolean }): Promise<Restaurant[]> {
    const res = await api.get<Restaurant[]>('/restaurants', { params: filters });
    return res.data;
  },

  async findOne(id: string): Promise<Restaurant> {
    const res = await api.get<Restaurant>(`/restaurants/${id}`);
    return res.data;
  },

  async create(data: Partial<Restaurant>): Promise<Restaurant> {
    const res = await api.post<Restaurant>('/restaurants', data);
    return res.data;
  },

  async update(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
    const res = await api.patch<Restaurant>(`/restaurants/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/restaurants/${id}`);
  },
};
