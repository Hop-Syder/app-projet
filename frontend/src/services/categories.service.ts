import { api } from './api';
import type { Category } from '../types';

export const categoriesService = {
  async findAll(activeOnly = true): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories', { params: { activeOnly } });
    return res.data;
  },

  async getTree(): Promise<Category[]> {
    const res = await api.get<Category[]>('/categories/tree');
    return res.data;
  },

  async findOne(id: string): Promise<Category> {
    const res = await api.get<Category>(`/categories/${id}`);
    return res.data;
  },

  async create(data: Partial<Category>): Promise<Category> {
    const res = await api.post<Category>('/categories', data);
    return res.data;
  },

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const res = await api.patch<Category>(`/categories/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
