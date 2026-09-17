import { api } from './api';
import type { Address } from '../types';

export const addressesService = {
  async findAll(): Promise<Address[]> {
    const res = await api.get<Address[]>('/addresses');
    return res.data;
  },

  async create(data: Partial<Address>): Promise<Address> {
    const res = await api.post<Address>('/addresses', data);
    return res.data;
  },

  async update(id: string, data: Partial<Address>): Promise<Address> {
    const res = await api.patch<Address>(`/addresses/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },
};
