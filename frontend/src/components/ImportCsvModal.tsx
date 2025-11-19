import { useState } from 'react';
import { api } from '../lib/api';

export default function ImportCsvModal({
  open, onClose, onImported,
}: { open: boolean; onClose: () => void; onImported: () => void; }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const doPreview = async () => {
    if (!file) return;
    setError(null); setBusy(true);
    try {
      const p = await api.previewImport(file);
      setPreview(p);
    } catch (e: any) {
      setError(e.message || 'Preview failed');
    } finally {
      setBusy(false);
    }
  };

  const doCommit = async () => {
    if (!preview) return;
    setError(null); setBusy(true);
    try {
      await api.commitImport(preview.batchId, preview.fileHash);
      onImported();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Commit failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 grid place-items-center p-4 z-50">
      <div className="bg-white rounded-xl shadow w-full max-w-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Import Products CSV</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div className="flex gap-2">
          <button onClick={doPreview} disabled={!file || busy} className="px-3 py-2 bg-gray-100 rounded">
            {busy ? 'Working…' : 'Preview'}
          </button>
          {preview && (
            <button onClick={doCommit} disabled={busy} className="px-3 py-2 bg-blue-600 text-white rounded">
              Commit
            </button>
          )}
        </div>
        {preview && (
          <div className="border rounded p-2 text-sm">
            <p className="mb-2 text-gray-600">Diff Summary</p>
            <pre className="overflow-auto max-h-64 bg-gray-50 p-2 rounded">
              {JSON.stringify(preview.summary ?? preview, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
