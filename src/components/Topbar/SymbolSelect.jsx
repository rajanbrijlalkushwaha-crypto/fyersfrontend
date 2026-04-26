import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

const API_BASE = process.env.REACT_APP_API_URL || '';

const INDICES_ORDER = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX', 'BANKEX'];

function indexRank(sym) {
  const i = INDICES_ORDER.indexOf(sym);
  return i === -1 ? 999 : i;
}

function sortSymbols(symbols, favs) {
  return [...symbols].sort((a, b) => {
    const af = favs.includes(a), bf = favs.includes(b);
    if (af && !bf) return -1;
    if (!af && bf) return 1;
    // Within same fav group: indices first, then alphabetical
    const ai = indexRank(a), bi = indexRank(b);
    if (ai !== bi) return ai - bi;
    return a.localeCompare(b);
  });
}

export default function SymbolSelect() {
  const { state, dispatch } = useApp();
  const [open, setOpen]     = useState(false);
  const [favs, setFavs]     = useState([]);
  const ref                 = useRef();
  const saveTimer           = useRef(null);

  // Load favourites from backend; fallback to localStorage
  useEffect(() => {
    if (!state.user) return;
    fetch(`${API_BASE}/api/auth/favourites`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d.favourites)) {
          setFavs(d.favourites);
          try { localStorage.setItem(`sym_favs_${state.user.id}`, JSON.stringify(d.favourites)); } catch (_) {}
        }
      })
      .catch(() => {
        // Backend unavailable — use localStorage cache
        try {
          const saved = JSON.parse(localStorage.getItem(`sym_favs_${state.user.id}`) || '[]');
          setFavs(Array.isArray(saved) ? saved : []);
        } catch (_) { setFavs([]); }
      });
  }, [state.user]);

  // Debounced save to backend
  const persistFavs = useCallback((next) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`${API_BASE}/api/auth/favourites`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favourites: next }),
      }).catch(() => {});
    }, 500);
  }, []);

  const saveFavs = (next) => {
    setFavs(next);
    try { localStorage.setItem(`sym_favs_${state.user?.id}`, JSON.stringify(next)); } catch (_) {}
    persistFavs(next);
  };

  const toggleFav = (e, sym) => {
    e.stopPropagation();
    saveFavs(favs.includes(sym) ? favs.filter(f => f !== sym) : [...favs, sym]);
  };

  const selectSymbol = (sym) => {
    dispatch({ type: 'SET_CURRENT_SYMBOL', payload: sym });
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sorted = sortSymbols(state.symbols, favs);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          fontSize: '15px', fontWeight: 'bold', padding: '4px 10px',
          background: 'white', color: 'black', border: '1px solid #ccc',
          borderRadius: '5px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '6px', minWidth: '120px',
        }}
      >
        {favs.includes(state.currentSymbol) && <span style={{ color: '#e53935' }}>♥</span>}
        {state.currentSymbol?.replace(/_/g, ' ') || 'Select…'}
        <span style={{ fontSize: '10px', marginLeft: 'auto' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 9999,
          background: '#fff', border: '1px solid #ccc', borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: '180px',
          maxHeight: '320px', overflowY: 'auto', marginTop: '2px',
        }}>
          {sorted.length === 0 && (
            <div style={{ padding: '10px', color: '#888', fontSize: '13px' }}>Loading…</div>
          )}
          {sorted.map(sym => {
            const isFav = favs.includes(sym);
            const isActive = sym === state.currentSymbol;
            const isIndex = indexRank(sym) < 999;
            return (
              <div
                key={sym}
                onClick={() => selectSymbol(sym)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 12px', cursor: 'pointer',
                  background: isActive ? '#fff3e0' : 'white',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '14px',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#f5f5f5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive ? '#fff3e0' : 'white'; }}
              >
                <button
                  onClick={(e) => toggleFav(e, sym)}
                  title={isFav ? 'Remove from favourites' : 'Add to favourites'}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '16px', padding: '0', lineHeight: 1,
                    color: isFav ? '#e53935' : '#bbb',
                    flexShrink: 0,
                  }}
                >
                  {isFav ? '♥' : '♡'}
                </button>
                <span style={{ flex: 1 }}>{sym.replace(/_/g, ' ')}</span>
                {isIndex && !isFav && <span style={{ fontSize: '9px', color: '#1976d2', fontWeight: 700, background: '#e3f2fd', borderRadius: 3, padding: '1px 4px' }}>IDX</span>}
                {isFav && <span style={{ fontSize: '10px', color: '#e53935', fontWeight: 700 }}>★</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
