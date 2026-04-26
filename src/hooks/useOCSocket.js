/**
 * hooks/useOCSocket.js
 *
 * Dedicated WebSocket hook for the option chain page.
 * Creates its OWN connection to /ws/live — completely independent from
 * the shared wsClient singleton used by other features (charts, AI, etc.).
 *
 * Benefits:
 *  - Option chain reconnects independently (one feature can't starve another)
 *  - Subscribes to the correct symbol the moment the socket opens
 *  - Handles full snapshot + incremental diffs in-hook (no global state needed)
 *
 * Protocol (matches backend ws/websocket.js):
 *   send:    { action: 'subscribe', symbol }
 *            { action: 'unsubscribe', symbol }
 *            { action: 'ping' }
 *   receive: { type: 'full', symbol, data: {...} }
 *            { type: 'diff', symbol, data: {...} }
 *            { type: 'pong' }
 */

import { useEffect, useRef, useState, useCallback } from 'react';

const RECONNECT_BASE = 1000;
const RECONNECT_MAX  = 15000;
const PING_MS        = 25000;

const norm = s => s?.toUpperCase().replace(/\s+/g, '_') || '';

function getWsUrl() {
  const apiBase = process.env.REACT_APP_API_URL;
  if (apiBase) return apiBase.replace(/^http/, 'ws') + '/ws/live';
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/ws/live`;
}

export function useOCSocket(symbol) {
  const wsRef        = useRef(null);
  const reconnectRef = useRef(null);
  const pingRef      = useRef(null);
  const delayRef     = useRef(RECONNECT_BASE);
  const symbolRef    = useRef(symbol);
  const mountedRef   = useRef(true);

  const [data,      setData]      = useState(null);
  const [connected, setConnected] = useState(false);

  // Keep symbolRef current so onopen always subscribes the latest symbol
  useEffect(() => { symbolRef.current = symbol; }, [symbol]);

  // Merge a diff patch into the previous snapshot
  const applyDiff = useCallback((diff, prev) => {
    if (!prev) return prev;
    const next = { ...prev };

    if (diff.spot_price         !== undefined) next.spot_price         = diff.spot_price;
    if (diff.spot_change        !== undefined) next.spot_change        = diff.spot_change;
    if (diff.spot_pct_change    !== undefined) next.spot_pct_change    = diff.spot_pct_change;
    if (diff.futures_ltp        !== undefined) next.futures_ltp        = diff.futures_ltp;
    if (diff.futures_change     !== undefined) next.futures_change     = diff.futures_change;
    if (diff.futures_pct_change !== undefined) next.futures_pct_change = diff.futures_pct_change;
    if (diff.lot_size           !== undefined) next.lot_size           = diff.lot_size;
    if (diff.time               !== undefined) next.time               = diff.time;
    if (diff.expiry             !== undefined) next.expiry             = diff.expiry;
    if (diff.date               !== undefined) next.date               = diff.date;

    if (diff.chain) {
      const map = {};
      for (const row of (prev.chain || [])) map[row.strike] = row;
      for (const [strike, changes] of Object.entries(diff.chain)) {
        const s = Number(strike);
        map[s] = map[s]
          ? {
              ...map[s],
              call: changes.call ? { ...map[s].call, ...changes.call } : map[s].call,
              put:  changes.put  ? { ...map[s].put,  ...changes.put  } : map[s].put,
            }
          : changes;
      }
      next.chain = Object.values(map).sort((a, b) => a.strike - b.strike);
    }

    return next;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    delayRef.current   = RECONNECT_BASE;

    function clearTimers() {
      clearTimeout(reconnectRef.current);
      clearInterval(pingRef.current);
    }

    function connect() {
      if (!mountedRef.current) return;
      clearTimers();

      const ws = new WebSocket(getWsUrl());
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return; }
        delayRef.current = RECONNECT_BASE;
        setConnected(true);

        // Subscribe to the current symbol (only if live mode — null means historical)
        const sym = symbolRef.current ? norm(symbolRef.current) : null;
        if (sym) ws.send(JSON.stringify({ action: 'subscribe', symbol: sym }));

        // Keepalive ping
        clearInterval(pingRef.current);
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'ping' }));
        }, PING_MS);
      };

      ws.onmessage = (evt) => {
        if (!mountedRef.current) return;
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === 'full') {
            setData(msg.data);
          } else if (msg.type === 'diff') {
            setData(prev => applyDiff(msg.data, prev));
          }
          // 'pong' and other types are silently ignored
        } catch (_) {}
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        clearInterval(pingRef.current);
        setConnected(false);
        reconnectRef.current = setTimeout(() => {
          delayRef.current = Math.min(delayRef.current * 2, RECONNECT_MAX);
          connect();
        }, delayRef.current);
      };

      ws.onerror = () => {};
    }

    connect();

    return () => {
      mountedRef.current = false;
      clearTimers();
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect timer on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnected(false);
    };
  }, []); // connect once on mount; reconnect loop handles the rest

  // When symbol changes: unsubscribe old, clear stale data, subscribe new
  const prevSymbolRef = useRef(null);
  useEffect(() => {
    const sym = symbol ? norm(symbol) : null;
    const ws  = wsRef.current;

    if (ws?.readyState === WebSocket.OPEN) {
      // Always unsubscribe previous symbol (handles null → live and live → null transitions)
      if (prevSymbolRef.current && prevSymbolRef.current !== sym) {
        ws.send(JSON.stringify({ action: 'unsubscribe', symbol: prevSymbolRef.current }));
        setData(null);
      }
      // Subscribe to new symbol only if non-null
      if (sym && sym !== prevSymbolRef.current) {
        ws.send(JSON.stringify({ action: 'subscribe', symbol: sym }));
      }
    }

    prevSymbolRef.current = sym;
  }, [symbol]);

  return { data, connected };
}
