const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, method: HttpMethod = 'GET', body?: any): Promise<T> {
  const headers: Record<string, string> = {};
  if (!(body instanceof FormData)) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as unknown as T) : res.json();
}

export const api = {
  //products
  listProducts: (q = '', page = 0, size = 250) =>
    request<any>(`/products?q=${encodeURIComponent(q)}&page=${page}&size=${size}`),

  upsertProductBySku: (sku: string, payload: any) =>
    request(`/products/sku/${encodeURIComponent(sku)}`, 'PUT', payload),

  //inventory
  adjust: (payload: { sku: string; delta: number; reason: string; note?: string }) =>
    request(`/inventory/adjust`, 'POST', payload),

  //imports
  previewImport: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request(`/imports/preview`, 'POST', form);
  },
  commitImport: (batchId: string, fileHash: string) =>
    request(`/imports/commit`, 'POST', { batchId, fileHash }),
};
