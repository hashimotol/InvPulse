import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Product = {
  id: number;
  sku: string;
  title: string;
  stock: number;
  reorder_threshold: number;
};

export default function ProductTable({ onAdjusted }: { onAdjusted: () => void }) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await api.listProducts(q);
      setItems(Array.isArray(data) ? data : data.items ?? []);
    } catch (e: any) {
      setErr(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const adjust = async (sku: string, delta: number) => {
    await api.adjust({ sku, delta, reason: delta > 0 ? 'restock' : 'sale' });
    await load();
    onAdjusted();
  };

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <div className="p-3 flex gap-2 items-center border-b">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search SKU or title"
          className="border rounded-md p-2 flex-1"
        />
        <button onClick={load} className="px-3 py-2 bg-gray-100 rounded-md">Search</button>
      </div>

      {err && <div className="p-3 text-sm text-red-600">{err}</div>}
      {loading && <div className="p-3 text-sm text-gray-500">Loading…</div>}

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">SKU</th>
            <th className="text-left p-3">Title</th>
            <th className="text-right p-3">Stock</th>
            <th className="text-left p-3">Status</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const status =
              p.stock <= 0 ? 'Out' : p.stock <= p.reorder_threshold ? 'Low' : 'OK';
            const badge =
              status === 'Out'
                ? 'bg-red-100 text-red-700'
                : status === 'Low'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-green-100 text-green-700';

            return (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-mono">{p.sku}</td>
                <td className="p-3">{p.title}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded ${badge}`}>{status}</span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => adjust(p.sku, -1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    Sell -1
                  </button>
                  <button
                    onClick={() => adjust(p.sku, +1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    Restock +1
                  </button>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && !loading && (
            <tr><td className="p-4 text-sm text-gray-500" colSpan={5}>No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
