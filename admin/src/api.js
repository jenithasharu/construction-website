import { clearToken, getValidToken } from './auth.js';

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Send a request to the backend and sign out if the backend rejects the token.
export async function apiRequest(path, options = {}) {
  const token = getValidToken();
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    clearToken();
    window.location.assign('/login');
    throw new Error('Your login has expired. Please sign in again.');
  }
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}
