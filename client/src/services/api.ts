import axios from 'axios';
import { Item, User } from '../types';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface ItemData extends Omit<Item, '_id' | 'reviews' | 'averageRating'> {
  reviews?: never;
  averageRating?: never;
}

interface ReviewData {
  rating: number;
  comment: string;
}

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData: RegisterData) => api.post<AuthResponse>('/auth/register', userData),
  login: (credentials: LoginData) => api.post<AuthResponse>('/auth/login', credentials),
};

export const items = {
  getAll: () => api.get<Item[]>('/items'),
  getById: (id: string) => api.get<Item>(`/items/${id}`),
  create: (itemData: ItemData) => api.post<Item>('/items', itemData),
  update: (id: string, itemData: Partial<ItemData>) => api.put<Item>(`/items/${id}`, itemData),
  delete: (id: string) => api.delete<void>(`/items/${id}`),
  addReview: (id: string, reviewData: ReviewData) =>
    api.post<Item>(`/items/${id}/reviews`, reviewData),
  getReviews: (id: string) => api.get<Item[]>(`/items/${id}/reviews`),
};

export const cart = {
  getCart: () => api.get('/cart'),
  addToCart: (itemId: string) => api.post(`/cart/add/${itemId}`),
  removeFromCart: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  purchase: () => api.post('/cart/purchase'),
};

export default api;
