// src/pages/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import ProductTable from '../components/ProductTable';
import ImportCsvModal from '../components/ImportCsvModal';
import { api } from '../lib/api';
import type { Product } from '../lib/api';

export default function ProductsPage() {
  const { user, logout } = useAuth(); // <-- NEW
  const [importOpen, setImportOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Simple stats: total products + low stock count
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingStats(true);
        const data = await api.listProducts();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch {
        setAllProducts([]);
      } finally {
        setLoadingStats(false);
      }
    };
    load();
  }, [refreshKey]);

  const handleImported = () => {
    setRefreshKey((k) => k + 1);
  };

  const total = allProducts.length;
  const lowStock = allProducts.filter(
    (p) => p.stock <= p.reorderThreshold
  ).length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Products
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse inventory, check low-stock items, and import products from CSV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Logout button RIGHT HERE */}
          {user && (
            <button
              onClick={logout}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setImportOpen(true)}
            className="px-3 py-2 text-xs rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Import CSV
          </button>
        </div>
      </div>

      {/* Simple stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-[11px] text-slate-500">Total products</p>
          <p className="text-lg font-semibold text-slate-900">
            {loadingStats ? '…' : total}
          </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
          <p className="text-[11px] text-slate-500">Low / out of stock</p>
          <p className="text-lg font-semibold text-amber-600">
            {loadingStats ? '…' : lowStock}
          </p>
        </div>
      </div>

      {/* Table */}
      <ProductTable refreshKey={refreshKey} />

      {/* CSV import modal */}
      <ImportCsvModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={handleImported}
      />
    </div>
  );
}
