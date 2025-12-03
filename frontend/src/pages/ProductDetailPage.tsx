// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import type { Product, InventoryTransaction } from '../lib/api';
import ProductStockChart from '../components/ProductStockChart';

function getStockStatus(product: Product) {
  const isLow = product.stock <= product.reorderThreshold;

  if (product.stock <= 0) {
    return {
      label: 'Out of stock',
      className: 'badge-red',
    };
  }

  if (isLow) {
    return {
      label: 'Low stock',
      className: 'badge-amber',
    };
  }

  return {
    label: 'Healthy stock',
    className: 'badge-green',
  };
}

type DeltaState = number | '' | '-';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [delta, setDelta] = useState<DeltaState>('');
  const [reason, setReason] = useState('');
  const [externalRef, setExternalRef] = useState('');
  const [busyAdjust, setBusyAdjust] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const [p, tx] = await Promise.all([
        api.getProduct(productId),
        api.listTransactions(productId, 50),
      ]);

      setProduct(p);
      setTransactions(tx);
    } catch (e: any) {
      if (e instanceof ApiError && e.status === 404) {
        setError('Product not found');
      } else {
        setError(e.message || 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setError('Invalid product id');
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleAdjust = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;

    // delta can be '', '-' or a number; only accept non-zero numbers
    if (delta === '' || delta === '-' || delta === 0) {
      setAdjustError('Delta must be non-zero');
      return;
    }

    const numericDelta = Number(delta);
    if (Number.isNaN(numericDelta) || numericDelta === 0) {
      setAdjustError('Delta must be a valid non-zero number');
      return;
    }

    setAdjustError(null);
    setBusyAdjust(true);

    try {
      await api.createTransaction(product.id, {
        delta: numericDelta,
        reason,
        externalReference: externalRef || undefined,
      });

      // reset form
      setDelta('');
      setReason('');
      setExternalRef('');

      // refresh data
      await load();
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.status === 403) {
          setAdjustError(
            'You do not have permission to adjust stock. Only ADMIN or MANAGER can modify inventory.'
          );
        } else {
          setAdjustError(err.message || 'Failed to adjust stock');
        }
      } else {
        setAdjustError('Failed to adjust stock');
      }
    } finally {
      setBusyAdjust(false);
    }
  };

  // ---------- Render states ----------

  if (loading) {
    return (
      <div className="card">
        <div className="card-body text-sm text-slate-500">
          Loading product…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="card">
          <div className="card-body">
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
              {error}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="text-xs text-blue-600 hover:underline"
        >
          ← Back to products
        </button>
      </div>
    );
  }

  if (!product) return null;

  const { label: stockLabel, className: stockClass } = getStockStatus(product);

  // ---------- Main UI ----------

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="page-title">{product.title}</h1>
          <p className="page-subtitle mt-1">
            SKU:{' '}
            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
              {product.sku}
            </span>
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs text-blue-600 hover:underline"
        >
          ← Back to products
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Product info card */}
        <div className="card">
          <div className="card-body space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Product info
              </h2>
              <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                <p>
                  <span className="font-medium text-slate-600">
                    Brand:
                  </span>{' '}
                  {product.brand ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-600">
                    Category:
                  </span>{' '}
                  {product.category ?? '—'}
                </p>
                <p>
                  <span className="font-medium text-slate-600">
                    Description:
                  </span>{' '}
                  {product.description ?? '—'}
                </p>
              </div>
            </div>

            {/* Stock summary */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">Stock</p>
                <p className="text-lg font-semibold text-slate-900">
                  {product.stock}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[11px] text-slate-500">
                  Reorder threshold
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  {product.reorderThreshold}
                </p>
              </div>
            </div>

            {/* Stock status */}
            <div>
              <span className={stockClass}>{stockLabel}</span>
            </div>
          </div>
        </div>

        {/* Adjust stock card */}
        <div className="card">
          <div className="card-body space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Adjust stock
              </h2>
              <p className="text-[11px] text-slate-500 mt-1">
                Positive values add stock, negative values remove stock.
                Stock cannot go below zero.
              </p>
            </div>

            {adjustError && (
              <p className="text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                {adjustError}
              </p>
            )}

            <form className="space-y-3" onSubmit={handleAdjust}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-medium mb-1 text-slate-700">
                    Delta
                  </label>
                  <input
                    type="number"
                    className="input-sm"
                    value={delta}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow empty string
                      if (value === '') {
                        setDelta('');
                        return;
                      }

                      // Allow "-" while typing a negative number
                      if (value === '-') {
                        setDelta('-');
                        return;
                      }

                      const num = Number(value);
                      if (!Number.isNaN(num)) {
                        setDelta(num);
                      }
                    }}
                    placeholder="e.g. -5"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] font-medium mb-1 text-slate-700">
                    Reason
                  </label>
                  <input
                    type="text"
                    className="input-sm"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Order #123"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium mb-1 text-slate-700">
                  External reference (optional)
                </label>
                <input
                  type="text"
                  className="input-sm"
                  value={externalRef}
                  onChange={(e) => setExternalRef(e.target.value)}
                  placeholder="ORDER-123-ITEM-1"
                />
              </div>

              <button
                type="submit"
                disabled={busyAdjust}
                className="btn-primary"
              >
                {busyAdjust ? 'Applying…' : 'Apply change'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stock history + transactions */}
      <div className="card">
        <div className="card-body space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Stock history
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">
              Visualizes the resulting stock level after each transaction.
            </p>
            <div className="mt-3">
              <ProductStockChart transactions={transactions} />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-slate-900 mb-2">
              Recent transactions
            </h3>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-500">
                No transactions yet for this product.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead className="table-head">
                    <tr>
                      <th className="table-cell text-left font-medium">
                        Date
                      </th>
                      <th className="table-cell text-right font-medium">
                        Delta
                      </th>
                      <th className="table-cell text-right font-medium">
                        Resulting stock
                      </th>
                      <th className="table-cell text-left font-medium">
                        Reason
                      </th>
                      <th className="table-cell text-left font-medium">
                        Actor
                      </th>
                      <th className="table-cell text-left font-medium">
                        External ref
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t, idx) => (
                      <tr
                        key={t.id}
                        className={`border-t border-slate-100 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                        }`}
                      >
                        <td className="table-cell">
                          {new Date(t.createdAt).toLocaleString()}
                        </td>
                        <td className="table-cell text-right">
                          {t.delta > 0 ? `+${t.delta}` : t.delta}
                        </td>
                        <td className="table-cell text-right">
                          {t.resultingStock}
                        </td>
                        <td className="table-cell">{t.reason}</td>
                        <td className="table-cell">{t.actor}</td>
                        <td className="table-cell">
                          {t.externalReference ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
