import { api } from './api';
import type { InventoryItem, StockStatus } from '../types';

export const inventoryService = {
  async findAll(filters?: { productId?: string; status?: StockStatus; search?: string }): Promise<InventoryItem[]> {
    const res = await api.get<InventoryItem[]>('/inventory', { params: filters });
    return res.data;
  },

  async getLowStock(threshold = 10): Promise<InventoryItem[]> {
    const res = await api.get<InventoryItem[]>('/inventory/low-stock', { params: { threshold } });
    return res.data;
  },

  async getExpired(): Promise<InventoryItem[]> {
    const res = await api.get<InventoryItem[]>('/inventory/expired');
    return res.data;
  },

  async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
    const res = await api.post<InventoryItem>('/inventory', data);
    return res.data;
  },

  async update(id: string, data: Partial<InventoryItem>): Promise<InventoryItem> {
    const res = await api.patch<InventoryItem>(`/inventory/${id}`, data);
    return res.data;
  },

  async adjust(id: string, adjustment: number, reason: string, notes?: string) {
    const res = await api.post(`/inventory/${id}/adjust`, { adjustment, reason, notes });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/inventory/${id}`);
  },
};
