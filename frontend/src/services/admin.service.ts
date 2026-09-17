import { api } from './api';
import type { AdminDashboard } from '../types';

export const adminService = {
  async getDashboard(): Promise<AdminDashboard> {
    const res = await api.get<AdminDashboard>('/admin/dashboard');
    return res.data;
  },
};
