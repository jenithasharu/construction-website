const TOKEN_KEY = 'northline_admin_token';

// Read the saved token only when it exists and has not passed its expiry time.
export function getValidToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart) throw new Error('Token has no payload');
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

// Save the login token or clear it when the admin signs out.
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
