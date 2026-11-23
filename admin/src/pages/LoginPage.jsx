import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getValidToken, saveToken } from '../auth.js';

// Let an admin sign in and save the one-hour token from the backend.
export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (getValidToken()) return <Navigate to="/enquiries" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Unable to sign in. Please try again.');
      saveToken(result.token);
      navigate('/enquiries', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not connect to the backend.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 py-12">
      <section className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-green font-display text-xl font-extrabold text-white">N</div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-green">Northline Construction</p>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Sign in to view project enquiries.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl border border-line bg-white p-7 shadow-[0_18px_60px_rgba(32,41,35,0.06)] sm:p-9">
          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="username">Username</label>
          <input id="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mb-5 w-full rounded-xl border border-line bg-paper/50 px-4 py-3 outline-none transition placeholder:text-muted/70 focus:border-green focus:ring-2 focus:ring-green/10" placeholder="Enter your username" />

          <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-line bg-paper/50 px-4 py-3 outline-none transition placeholder:text-muted/70 focus:border-green focus:ring-2 focus:ring-green/10" placeholder="Enter your password" />

          {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="mt-7 w-full rounded-full bg-green px-5 py-3.5 font-semibold text-white transition hover:bg-green-dark disabled:cursor-wait disabled:opacity-65">
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">Your session is protected and expires after one hour.</p>
      </section>
    </main>
  );
}
