import { api } from './api';
import type { Role, User } from '../types';

export const usersService = {
  async findAll(): Promise<User[]> {
    const res = await api.get<User[]>('/users');
    return res.data;
  },

  async findOne(id: string) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async updateRole(id: string, role: Role): Promise<User> {
    const res = await api.patch<User>(`/users/${id}/role`, { role });
    return res.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
