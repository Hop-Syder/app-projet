import { api } from './api';
import type { Product } from '../types';

export interface ProductFilters {
  categoryId?: string;
  animalId?: string;
  search?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
}

export type ProductInput = Partial<Omit<Product, 'cutOptions' | 'packagingOptions'>> & {
  cutOptions?: { name: string; priceModifier: number }[];
  packagingOptions?: { name: string; priceModifier: number }[];
};

export const productsService = {
  async findAll(filters: ProductFilters = {}): Promise<Product[]> {
    const params: Record<string, string> = {};
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.animalId) params.animalId = filters.animalId;
    if (filters.search) params.search = filters.search;
    if (filters.isAvailable !== undefined) params.isAvailable = String(filters.isAvailable);
    if (filters.isFeatured !== undefined) params.isFeatured = String(filters.isFeatured);
    const res = await api.get<Product[]>('/products', { params });
    return res.data;
  },

  async getFeatured(limit = 8): Promise<Product[]> {
    const res = await api.get<Product[]>('/products/featured', { params: { limit } });
    return res.data;
  },

  async findBySlug(slug: string): Promise<Product> {
    const res = await api.get<Product>(`/products/slug/${slug}`);
    return res.data;
  },

  async findOne(id: string): Promise<Product> {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },

  async create(data: ProductInput): Promise<Product> {
    const res = await api.post<Product>('/products', data);
    return res.data;
  },

  async update(id: string, data: ProductInput): Promise<Product> {
    const res = await api.patch<Product>(`/products/${id}`, data);
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async addImage(id: string, url: string, alt?: string, isPrimary?: boolean) {
    const res = await api.post(`/products/${id}/images`, { url, alt, isPrimary });
    return res.data;
  },
};
