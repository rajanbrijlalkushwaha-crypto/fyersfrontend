import { useEffect, useRef, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || '';
const POLL_MS  = 10000;

export default function MarqueeTicker() {
  const [items,   setItems]   = useState([]);
  const intervalRef           = useRef(null);

  const load = () => {
    fetch(`${API_BASE}/api/ticker`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.success && d.items?.length) setItems(d.items); })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, POLL_MS);
    return () => clearInterval(intervalRef.current);
  }, []);

  if (!items.length) return null;

  // Duplicate items so the scroll looks seamless
  const display = [...items, ...items];

  return (
    <div style={{
      width: '100%',
      background: '#0a0a0f',
      borderBottom: '1px solid #1e1e2e',
      height: '24px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        whiteSpace: 'nowrap',
        animation: `tickerScroll ${items.length * 15}s linear infinite`,
        willChange: 'transform',
      }}>
        {display.map((item, i) => {
          const pos = item.change >= 0;
          const color = pos ? '#22c55e' : '#ef4444';
          const arrow = pos ? '▲' : '▼';
          return (
            <span key={i} style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px' }}>
              <span style={{ color: '#c9d1d9' }}>{item.symbol}</span>
              {' '}
              <span style={{ color: '#e6edf3' }}>{item.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              {' '}
              <span style={{ color }}>{arrow} {Math.abs(item.change).toFixed(2)} ({Math.abs(item.pct).toFixed(2)}%)</span>
            </span>
          );
        })}
      </div>

      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
