const Auth = {
  getToken() { return localStorage.getItem('token'); },
  setToken(t) { localStorage.setItem('token', t); },
  getUser() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },
  setUser(u) { localStorage.setItem('user', JSON.stringify(u)); },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isLoggedIn() { return !!this.getToken(); },
  isAdmin() { return this.getUser()?.role === 'admin'; },
};

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(path, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text }; }

  if (!res.ok) {
    const err = new Error((data && data.error) || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}
