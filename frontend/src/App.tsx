// src/App.tsx
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

import './App.css';

function AppShell() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo + App Name */}
          <Link to="/products" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white grid place-items-center text-xs font-bold">
              IP
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-sm">InventoryPulse</span>
              <span className="text-[11px] text-slate-500">
                Lightweight inventory dashboard
              </span>
            </div>
          </Link>

          {/* Right side: user info + logout */}
          <div className="flex items-center gap-3 text-xs">
            {loading && (
              <span className="text-slate-400">Checking session…</span>
            )}

            {/* Always show logout when authenticated */}
            {isAuthenticated && (
              <>
                {/* Show user email + role IF your backend returns them */}
                {user && (
                  <span className="text-slate-600 hidden sm:inline">
                    {user.email}{' '}
                    <span className="uppercase text-[10px] bg-slate-100 px-1.5 py-0.5 rounded ml-1">
                      {user.role}
                    </span>
                  </span>
                )}

                <button
                  onClick={logout}
                  className="px-3 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/" element={<Navigate to="/products" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
