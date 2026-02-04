export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookRequest {
  title: string;
  author: string;
  isbn?: string;
  publishedDate?: string;
  description?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}
