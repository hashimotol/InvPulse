// src/components/ImportCsvModal.tsx
import { useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { ImportResult } from '../lib/api';

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

export default function ImportCsvModal({ open, onClose, onImported }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!open) return null;

  const handleUpload = async () => {
    if (!file) return;
    setError(null);
    setBusy(true);
    setResult(null);
    try {
      const res = await api.importProducts(file);
      setResult(res);
      onImported();
    } catch (e: any) {
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError('Upload failed');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 space-y-4 border border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Import products CSV
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              File must include a header row with:
              <br />
              <code className="text-[10px] bg-slate-100 px-1 py-0.5 rounded">
                sku,title,description,brand,category,imageUrl,stock,reorderThreshold
              </code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <div className="space-y-2">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-xs"
          />
          <p className="text-[11px] text-slate-500">
            Stock and reorderThreshold must be integers. Existing SKUs may
            trigger conflicts.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || busy}
            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {result && (
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50 text-xs space-y-1">
            <p className="font-semibold text-slate-800">Import result</p>
            <p>Total rows: {result.totalRows}</p>
            <p>Imported: {result.imported}</p>
            <p>Skipped: {result.skipped}</p>
          </div>
        )}
      </div>
    </div>
  );
}
