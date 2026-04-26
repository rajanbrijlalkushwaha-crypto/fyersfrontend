/**
 * ws/wsClient.js
 *
 * Shared singleton WebSocket client.
 * All components share ONE connection to /ws/live.
 *
 * Features:
 *  - Auto-reconnect with exponential backoff
 *  - Real connection-state listeners (components can know if WS is truly open)
 *  - Symbol subscribe/unsubscribe (live option chain updates)
 *  - Promise-based chart data requests (get_chart)
 *  - Broadcast listener registry (AI signals, etc.)
 */

const WS_PATH        = '/ws/live';
const RECONNECT_BASE = 1000;
const RECONNECT_MAX  = 30000;
const PING_INTERVAL  = 25000;

let ws             = null;
let reconnectTimer = null;
let pingTimer      = null;
let reconnectDelay = RECONNECT_BASE;
let _isConnected   = false;

// symbol → Set<callback(msg)>
const symbolListeners = new Map();

// requestId → { resolve, reject, timer }
const pendingCharts = new Map();

// type → Set<callback(data)>
const broadcastListeners = new Map();

// Connection state listeners — called with true/false
const connListeners = new Set();

let _reqId = 1;
const nextId = () => `cr_${_reqId++}`;

// Normalize to match server: toUpperCase + spaces→underscores
const norm = s => s?.toUpperCase().replace(/\s+/g, '_') || '';

function getWsUrl() {
  const apiBase = process.env.REACT_APP_API_URL;
  if (apiBase) return apiBase.replace(/^http/, 'ws') + WS_PATH;
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}${WS_PATH}`;
}

function setConnected(val) {
  if (_isConnected === val) return;
  _isConnected = val;
  connListeners.forEach(cb => cb(val));
}

function clearPing() {
  if (pingTimer) { clearInterval(pingTimer); pingTimer = null; }
}

function startPing() {
  clearPing();
  pingTimer = setInterval(() => {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'ping' }));
  }, PING_INTERVAL);
}

function dispatch(msg) {
  if (msg.type === 'full' || msg.type === 'diff') {
    const sym = norm(msg.symbol);
    const listeners = symbolListeners.get(sym);
    if (listeners) listeners.forEach(cb => cb(msg));

  } else if (msg.type === 'error') {
    if (msg.symbol) {
      const listeners = symbolListeners.get(norm(msg.symbol));
      if (listeners) listeners.forEach(cb => cb(msg));
    } else {
      for (const listeners of symbolListeners.values()) {
        listeners.forEach(cb => cb(msg));
      }
    }

  } else if (msg.type === 'chart_data') {
    const pending = pendingCharts.get(msg.id);
    if (pending) { clearTimeout(pending.timer); pending.resolve(msg.data); pendingCharts.delete(msg.id); }

  } else if (msg.type === 'chart_error') {
    const pending = pendingCharts.get(msg.id);
    if (pending) { clearTimeout(pending.timer); pending.reject(new Error(msg.message)); pendingCharts.delete(msg.id); }

  } else if (msg.type === 'broadcast') {
    const listeners = broadcastListeners.get(msg.broadcastType);
    if (listeners) listeners.forEach(cb => cb(msg.data));
    const all = broadcastListeners.get('*');
    if (all) all.forEach(cb => cb(msg));
  }
}

function connect() {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) return;

  ws = new WebSocket(getWsUrl());

  ws.onopen = () => {
    reconnectDelay = RECONNECT_BASE;
    setConnected(true);
    startPing();
    // Re-subscribe all active symbols after reconnect
    for (const symbol of symbolListeners.keys()) {
      ws.send(JSON.stringify({ action: 'subscribe', symbol }));
    }
  };

  ws.onmessage = (event) => {
    try { dispatch(JSON.parse(event.data)); } catch (_) {}
  };

  ws.onclose = () => {
    clearPing();
    setConnected(false);
    reconnectTimer = setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 2, RECONNECT_MAX);
      connect();
    }, reconnectDelay);
  };

  ws.onerror = () => {};
}

function ensureConnected() {
  if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
    connect();
  }
}

function send(msg) {
  ensureConnected();
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
    return true;
  }
  return false;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/** Get current WS connection state */
export function isConnected() { return _isConnected; }

/** Subscribe to WS connection state changes. Returns unsubscribe function. */
export function onConnectionChange(callback) {
  connListeners.add(callback);
  callback(_isConnected); // fire immediately with current state
  return () => connListeners.delete(callback);
}

/** Subscribe to live option chain updates for a symbol */
export function subscribeSymbol(rawSymbol, callback) {
  const symbol = norm(rawSymbol);
  ensureConnected();
  if (!symbolListeners.has(symbol)) symbolListeners.set(symbol, new Set());
  symbolListeners.get(symbol).add(callback);
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'subscribe', symbol }));
  return () => unsubscribeSymbol(symbol, callback);
}

/** Unsubscribe a callback */
export function unsubscribeSymbol(rawSymbol, callback) {
  const symbol = norm(rawSymbol);
  const set = symbolListeners.get(symbol);
  if (!set) return;
  set.delete(callback);
  if (set.size === 0) {
    symbolListeners.delete(symbol);
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'unsubscribe', symbol }));
  }
}

/**
 * Request chart data via WebSocket.
 * Falls back to HTTP if WS not connected after 1s.
 */
export function requestChart(chartType, symbol, expiry, date, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    ensureConnected();
    const id = nextId();
    const timer = setTimeout(() => {
      pendingCharts.delete(id);
      reject(new Error('Chart request timed out'));
    }, timeoutMs);
    pendingCharts.set(id, { resolve, reject, timer });
    const sent = send({ action: 'get_chart', id, chart_type: chartType, symbol, expiry, date });
    if (!sent) {
      clearTimeout(timer);
      pendingCharts.delete(id);
      // WS not ready — fall back to HTTP immediately
      const _apiBase = process.env.REACT_APP_API_URL || '';
      fetch(`${_apiBase}/api/chart/${chartType}/${encodeURIComponent(symbol)}/${encodeURIComponent(expiry)}/${date}`, { credentials: 'include' })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP error')))
        .then(resolve)
        .catch(reject);
    }
  });
}

/** Listen for broadcast messages (AI signals etc.) */
export function onBroadcast(type, callback) {
  if (!broadcastListeners.has(type)) broadcastListeners.set(type, new Set());
  broadcastListeners.get(type).add(callback);
  return () => {
    const s = broadcastListeners.get(type);
    if (s) s.delete(callback);
  };
}

// Auto-connect when module loads
connect();
