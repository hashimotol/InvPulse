// src/components/ProductTable.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { Product } from '../lib/api';

type Props = {
  refreshKey?: number; // when this changes, reload products
};

export default function ProductTable({ refreshKey = 0 }: Props) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await api.listProducts(q);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
      {/* Search bar */}
      <div className="p-3 flex gap-2 items-center border-b border-slate-100 bg-slate-50/60">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by SKU, title, brand, or category…"
          className="border border-slate-200 rounded-lg px-3 py-2 text-xs flex-1 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
        />
        <button
          onClick={load}
          className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800"
        >
          Search
        </button>
      </div>

      {/* Error / loading */}
      {err && (
        <div className="px-3 py-2 text-xs text-red-700 bg-red-50 border-b border-red-100">
          {err}
        </div>
      )}
      {loading && (
        <div className="px-3 py-2 text-xs text-slate-500">
          Loading products…
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
            <tr>
              <th className="text-left px-3 py-2 font-medium">SKU</th>
              <th className="text-left px-3 py-2 font-medium">Title</th>
              <th className="text-left px-3 py-2 font-medium">Brand</th>
              <th className="text-left px-3 py-2 font-medium">Category</th>
              <th className="text-right px-3 py-2 font-medium">Stock</th>
              <th className="text-right px-3 py-2 font-medium">
                Reorder
              </th>
              <th className="text-left px-3 py-2 font-medium">Status</th>
              <th className="text-right px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p, idx) => {
              const isLow = p.stock <= p.reorderThreshold;
              const status =
                p.stock <= 0 ? 'Out of stock' : isLow ? 'Low stock' : 'OK';

              const badgeClasses =
                p.stock <= 0
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : isLow
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100';

              return (
                <tr
                  key={p.id}
                  className={`border-t border-slate-100 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-[11px] text-slate-700">
                    {p.sku}
                  </td>
                  <td className="px-3 py-2 text-slate-900">{p.title}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {p.brand ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {p.category ?? '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-900">
                    {p.stock}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">
                    {p.reorderThreshold}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] ${badgeClasses}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to={`/products/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View details
                    </Link>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && !loading && (
              <tr>
                <td
                  className="p-4 text-xs text-slate-500 text-center"
                  colSpan={8}
                >
                  No products found. Try adjusting your search or import a CSV.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
