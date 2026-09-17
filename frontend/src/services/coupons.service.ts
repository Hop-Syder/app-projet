import { api } from './api';
import type { Coupon } from '../types';

export const couponsService = {
  async findAll(): Promise<Coupon[]> {
    const res = await api.get<Coupon[]>('/coupons');
    return res.data;
  },

  async validate(code: string, orderAmount: number): Promise<{ coupon: Coupon; discount: number }> {
    const res = await api.post(`/coupons/validate/${code}`, { orderAmount });
    return res.data;
  },

  async create(data: Partial<Coupon>): Promise<Coupon> {
    const res = await api.post<Coupon>('/coupons', data);
    return res.data;
  },

  async update(id: string, data: Partial<Coupon>): Promise<Coupon> {
    const res = await api.patch<Coupon>(`/coupons/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/coupons/${id}`);
  },
};
