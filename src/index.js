import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import AuthPage from './components/auth/Auth';
import App from './app.jsx';
import AdminApp from './components/admin/AdminApp';
import './styles/index.css';

// Inject X-Requested-By on every /api/* fetch — blocks direct browser URL access
const _nativeFetch = window.fetch.bind(window);
window.fetch = (input, init = {}) => {
  const url = typeof input === 'string' ? input : input?.url || '';
  if (url.includes('/api/')) {
    const headers = new Headers(init.headers || {});
    headers.set('X-Requested-By', 'soc-app');
    init = { ...init, headers };
  }
  return _nativeFetch(input, init);
};

const API_BASE = process.env.REACT_APP_API_URL || '';
const AUTH_CACHE_KEY = 'soc_auth_state';

function MainApp() {
  const params = new URLSearchParams(window.location.search);

  // Read cached auth state immediately — zero wait for returning users
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (params.get('reset_token')) return false; // force auth page for reset links
    try {
      const c = localStorage.getItem(AUTH_CACHE_KEY);
      if (c) return JSON.parse(c).authenticated === true;
    } catch (_) {}
    return null; // null = unknown (first visit)
  });

  useEffect(() => {
    // Always verify session with server in background
    fetch(`${API_BASE}/api/auth/check-session`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        const auth = !!data.authenticated;
        setIsAuthenticated(auth);
        try { localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ authenticated: auth })); } catch (_) {}
      })
      .catch(() => {
        // Network error — keep cached state so offline users see the app
      });
  }, []);

  if (params.get('reset_token')) return <AuthPage />;

  // Unknown auth state (first visit, no cache) → show login page immediately.
  // If session check comes back authenticated, React re-renders to <App />.
  if (isAuthenticated === null) return <AuthPage />;

  if (isAuthenticated) return <App />;
  return <AuthPage />;
}

function Root() {
  if (window.location.pathname === '/admin') return <AdminApp />;
  return <MainApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
