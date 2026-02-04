import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest, Book, BookRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },
};

// Books API
export const booksApi = {
  getAll: async (): Promise<Book[]> => {
    const response = await api.get<Book[]>('/api/books');
    return response.data;
  },

  getById: async (id: number): Promise<Book> => {
    const response = await api.get<Book>(`/api/books/${id}`);
    return response.data;
  },

  create: async (data: BookRequest): Promise<Book> => {
    const response = await api.post<Book>('/api/books', data);
    return response.data;
  },

  update: async (id: number, data: BookRequest): Promise<Book> => {
    const response = await api.put<Book>(`/api/books/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/books/${id}`);
  },
};

export default api;
