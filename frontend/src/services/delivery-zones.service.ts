import { api } from './api';
import type { DeliveryZone } from '../types';

export const deliveryZonesService = {
  async findAll(activeOnly = true): Promise<DeliveryZone[]> {
    const res = await api.get<DeliveryZone[]>('/delivery-zones', { params: { activeOnly } });
    return res.data;
  },

  async create(data: Partial<DeliveryZone>): Promise<DeliveryZone> {
    const res = await api.post<DeliveryZone>('/delivery-zones', data);
    return res.data;
  },

  async update(id: string, data: Partial<DeliveryZone>): Promise<DeliveryZone> {
    const res = await api.patch<DeliveryZone>(`/delivery-zones/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/delivery-zones/${id}`);
  },
};
