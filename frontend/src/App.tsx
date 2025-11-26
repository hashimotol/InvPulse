import { useEffect, useState } from 'react';
import ProductTable from './components/ProductTable';
import ImportCsvModal from './components/ImportCsvModal';
import { api } from './lib/api';

export default function App() {
  const [counts, setCounts] = useState({ total: 0, low: 0 });
  const [openImport, setOpenImport] = useState(false);

  const refreshCounts = async () => {
    const data = await api.listProducts('');
    const items = Array.isArray(data) ? data : (data.items ?? []);
    const total = items.length;
    const low = items.filter((p: any) => p.stock <= 0 || p.stock <= p.reorder_threshold).length;
    setCounts({ total, low });
  };

  useEffect(() => { refreshCounts(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">InventoryPulse</h1>
          <button
            onClick={() => setOpenImport(true)}
            className="px-3 py-2 bg-blue-600 text-white rounded-md"
          >
            Import CSV
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total SKUs" value={counts.total} />
          <StatCard label="Low/Out" value={counts.low} />
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Products</h2>
        </div>

        <ProductTable onAdjusted={refreshCounts} />

        <ImportCsvModal
          open={openImport}
          onClose={() => setOpenImport(false)}
          onImported={refreshCounts}
        />
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
