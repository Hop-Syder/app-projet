import { api } from './api';
import type { Payment } from '../types';

export const paymentsService = {
  async initiate(orderId: string, method: 'CASH' | 'MOBILE_MONEY' | 'CARD', provider?: string): Promise<Payment> {
    const res = await api.post<Payment>('/payments', { orderId, method, provider });
    return res.data;
  },

  async findByOrder(orderId: string): Promise<Payment[]> {
    const res = await api.get<Payment[]>(`/payments/order/${orderId}`);
    return res.data;
  },

  async confirm(id: string, transactionId?: string): Promise<Payment> {
    const res = await api.patch<Payment>(`/payments/${id}/confirm`, { transactionId });
    return res.data;
  },
};
