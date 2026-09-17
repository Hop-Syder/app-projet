import { api } from './api';
import type { Review } from '../types';

export const reviewsService = {
  async findAll(filters?: { productId?: string; restaurantId?: string; approvedOnly?: boolean }): Promise<Review[]> {
    const res = await api.get<Review[]>('/reviews', { params: filters });
    return res.data;
  },

  async create(data: { orderId?: string; productId?: string; restaurantId?: string; rating: number; title?: string; comment?: string }): Promise<Review> {
    const res = await api.post<Review>('/reviews', data);
    return res.data;
  },

  async approve(id: string): Promise<Review> {
    const res = await api.patch<Review>(`/reviews/${id}/approve`);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/reviews/${id}`);
  },
};
