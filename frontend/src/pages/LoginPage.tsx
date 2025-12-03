// src/pages/LoginPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const from =
    (location.state as any)?.from?.pathname ?? '/products';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] grid place-items-center">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
        <h1 className="text-lg font-semibold mb-1 text-slate-900">
          Sign in
        </h1>
        <p className="text-xs text-slate-500 mb-4">
          Use your InventoryPulse admin or manager account.
        </p>

        {error && (
          <div className="mb-3 text-xs text-red-700 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-700">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-slate-700">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-[11px] text-slate-500 text-center">
            Don&apos;t have an account?{' '}
            <Link
            to="/register"
            className="text-blue-600 hover:underline"
            >
            Create one
            </Link>
        </p>
      </div>
    </div>
  );
}
