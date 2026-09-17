import { api } from './api';
import type { AuthResponse, LoginDto, RegisterDto, User } from '../types';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    this.persist(res.data);
    return res.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    this.persist(res.data);
    return res.data;
  },

  persist(auth: AuthResponse) {
    localStorage.setItem('token', auth.access_token);
    const { access_token, ...user } = auth;
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getStoredUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  },

  async getProfile() {
    const res = await api.get('/users/me/profile');
    return res.data;
  },
};
