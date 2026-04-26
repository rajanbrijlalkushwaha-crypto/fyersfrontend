/**
 * hooks/useOptionChainWS.js
 *
 * React hook — subscribes to live option chain updates for a symbol.
 * Uses the shared wsClient singleton (one WebSocket for all components).
 * `connected` reflects the real WS connection state.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { subscribeSymbol, onConnectionChange } from '../ws/wsClient';

export function useOptionChainWS(symbol) {
  const [data,      setData]      = useState(null);
  const [connected, setConnected] = useState(false);
  const [error,     setError]     = useState(null);

  // Track real WS connection state
  useEffect(() => {
    const unsub = onConnectionChange(setConnected);
    return unsub;
  }, []);

  const applyDiff = useCallback((diff) => {
    setData(prev => {
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
        const chainMap = {};
        for (const row of (prev.chain || [])) chainMap[row.strike] = row;
        for (const [strike, changes] of Object.entries(diff.chain)) {
          const s = Number(strike);
          if (!chainMap[s]) {
            chainMap[s] = changes;
          } else {
            chainMap[s] = {
              ...chainMap[s],
              call: changes.call ? { ...chainMap[s].call, ...changes.call } : chainMap[s].call,
              put:  changes.put  ? { ...chainMap[s].put,  ...changes.put  } : chainMap[s].put,
            };
          }
        }
        next.chain = Object.values(chainMap).sort((a, b) => a.strike - b.strike);
      }

      return next;
    });
  }, []);

  const unsubRef = useRef(null);

  useEffect(() => {
    if (!symbol) return;

    setData(null);
    setError(null);

    const handler = (msg) => {
      if (msg.type === 'full') {
        setData(msg.data);
        setError(null);
      } else if (msg.type === 'diff') {
        applyDiff(msg.data);
      } else if (msg.type === 'error') {
        setError(msg.message);
      }
    };

    unsubRef.current = subscribeSymbol(symbol, handler);

    return () => {
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null; }
    };
  }, [symbol, applyDiff]);

  return { data, connected, error };
}
