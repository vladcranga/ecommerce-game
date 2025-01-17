import axios from 'axios';

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
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
};

export const items = {
  getAll: () => api.get('/items'),
  getById: (id: string) => api.get(`/items/${id}`),
  create: (itemData: any) => api.post('/items', itemData),
  update: (id: string, itemData: any) => api.put(`/items/${id}`, itemData),
  delete: (id: string) => api.delete(`/items/${id}`),
  addReview: (id: string, reviewData: any) => api.post(`/items/${id}/reviews`, reviewData),
  getReviews: (id: string) => api.get(`/items/${id}/reviews`),
};

export const cart = {
  getCart: () => api.get('/cart'),
  addToCart: (itemId: string) => api.post(`/cart/add/${itemId}`),
  removeFromCart: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  purchase: () => api.post('/cart/purchase'),
};

export default api;
