import { api } from './api';
import type { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res = await api.get<Cart>('/cart');
    return res.data;
  },

  async addItem(data: {
    productId: string;
    quantity: number;
    weight?: number;
    cutOptionId?: string;
    packagingOptionId?: string;
  }): Promise<Cart> {
    const res = await api.post<Cart>('/cart/items', data);
    return res.data;
  },

  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    const res = await api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const res = await api.delete<Cart>(`/cart/items/${itemId}`);
    return res.data;
  },

  async clear(): Promise<Cart> {
    const res = await api.delete<Cart>('/cart');
    return res.data;
  },
};
