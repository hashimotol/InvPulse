// src/lib/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, message: string, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: any
): Promise<T> {
  const headers: Record<string, string> = {};

  const token = localStorage.getItem('accessToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    let errorBody: any = null;
    try {
      errorBody = await res.json();
    } catch {
      // ignore
    }
    const message =
      errorBody?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, message, errorBody);
  }

  if (res.status === 204) {
    // No content
    return undefined as unknown as T;
  }

  try {
    const data = await res.json();
    return data as T;
  } catch {
    return undefined as unknown as T;
  }
}

/* ====== Data types ====== */


export type AuthResponse = {
  accessToken: string;
  tokenType: string; // "Bearer"
  expiresInMillis: number;
};

export type Role = 'ADMIN' | 'MANAGER' | 'VIEWER';

export type CurrentUser = {
  id: number;
  email: string;
  username: string;
  role: Role;
  createdAt: string;
};

export type Product = {
  id: number;
  sku: string;
  title: string;
  description?: string | null;
  brand?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  stock: number;
  reorderThreshold: number;
};

export type InventoryTransaction = {
  id: number;
  productId: number;
  delta: number;
  reason: string;
  externalReference?: string | null;
  actor: string;
  createdAt: string;
  resultingStock: number;
};

export type ImportResult = {
  totalRows: number;
  imported: number;
  skipped: number;
};

/* ====== API  ====== */

export const api = {
  // Auth
  login: (payload: { email: string; password: string }) =>
    request<AuthResponse>('/api/auth/login', 'POST', payload),

  register: (payload: { email: string; username: string; password: string }) =>
    request<void>('/api/auth/register', 'POST', payload),

  getCurrentUser: () =>
    request<CurrentUser>('/api/auth/me', 'GET'),

  // Products
  listProducts: (q?: string) => {
    const trimmed = q?.trim();
    if (trimmed && trimmed.length > 0) {
      return request<Product[]>(
        `/api/products/search?q=${encodeURIComponent(trimmed)}`,
        'GET'
      );
    }
    return request<Product[]>('/api/products', 'GET');
  },

  getLowStockProducts: () =>
    request<Product[]>('/api/products/low-stock', 'GET'),

  getProduct: (id: number) =>
    request<Product>(`/api/products/${id}`, 'GET'),

  createProduct: (payload: Omit<Product, 'id'>) =>
    request<Product>('/api/products', 'POST', payload),

  updateProduct: (id: number, payload: Omit<Product, 'id'>) =>
    request<Product>(`/api/products/${id}`, 'PUT', payload),

  deleteProduct: (id: number) =>
    request<void>(`/api/products/${id}`, 'DELETE'),

  // Import CSV
  importProducts: (file: File) => {
    const form = new FormData();
    form.append('file', file); 
    return request<ImportResult>('/api/products/import', 'POST', form);
  },

  // Inventory transactions
  listTransactions: (productId: number, limit = 50) =>
    request<InventoryTransaction[]>(
      `/api/products/${productId}/transactions?limit=${limit}`,
      'GET'
    ),

  createTransaction: (
    productId: number,
    payload: { delta: number; reason: string; externalReference?: string }
  ) =>
    request<InventoryTransaction>(
      `/api/products/${productId}/transactions`,
      'POST',
      payload
    ),
};
