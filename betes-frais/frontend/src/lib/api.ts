const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  message: string;
  statusCode: number;
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Récupérer le token depuis le localStorage si présent
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'Une erreur est survenue',
        statusCode: response.status,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    if ((error as ApiError).statusCode) {
      throw error;
    }
    throw {
      message: 'Erreur de connexion au serveur',
      statusCode: 0,
    } as ApiError;
  }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (data: any) =>
    fetchApi<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return fetchApi<any[]>(`/products${queryString ? `?${queryString}` : ''}`);
  },
  
  getProduct: (slug: string) =>
    fetchApi<any>(`/products/${slug}`),

  // Categories
  getCategories: () =>
    fetchApi<any[]>('/categories'),

  // Orders
  getOrders: () =>
    fetchApi<any[]>('/orders'),
  
  getOrder: (id: string) =>
    fetchApi<any>(`/orders/${id}`),
  
  createOrder: (data: any) =>
    fetchApi<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Restaurants
  getRestaurants: () =>
    fetchApi<any[]>('/restaurants'),
  
  getRestaurant: (id: string) =>
    fetchApi<any>(`/restaurants/${id}`),

  // Delivery
  calculateDelivery: (addressId: string, orderId: string) =>
    fetchApi<any>('/delivery/calculate', {
      method: 'POST',
      body: JSON.stringify({ addressId, orderId }),
    }),

  // User
  getProfile: () =>
    fetchApi<any>('/users/profile'),
  
  updateProfile: (data: any) =>
    fetchApi<any>('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export default api;
