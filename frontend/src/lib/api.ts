// src/lib/api.ts
export const API_BASE_URL = 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: any
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
}

/* ====== Types ====== */

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMillis: number;
};

export type Product = {
  id: number;
  sku: string;
  title: string;
  stock: number;
};

/* ====== API ====== */

export const api = {
  // Auth
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', 'POST', payload),

  register: (payload: { email: string; username: string; password: string }) =>
    request<void>('/api/auth/register', 'POST', payload),

  // Products
  listProducts: () =>
    request<Product[]>('/api/products', 'GET'),

  getProduct: (id: number) =>
    request<Product>(`/api/products/${id}`, 'GET'),
};
