// src/pages/RegisterPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Register:', { email, username, password });
  };

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Confirm password</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}