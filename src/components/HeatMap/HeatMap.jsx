import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import './HeatMap.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

const SECTOR_ORDER = ['Indices', 'IT', 'Banking', 'Finance', 'Energy', 'Infrastructure', 'Pharma', 'FMCG', 'Metals'];

function getTileColor(pct) {
  if (pct >=  3) return '#00c853';
  if (pct >=  2) return '#00b248';
  if (pct >=  1) return '#00963d';
  if (pct >= 0.5) return '#007a32';
  if (pct >=  0) return '#1b5e20';
  if (pct >= -0.5) return '#7a1010';
  if (pct >= -1) return '#9b1212';
  if (pct >= -2) return '#c01515';
  if (pct >= -3) return '#d42020';
  return '#e53935';
}

export default function HeatMap() {
  const { state, dispatch } = useApp();
  const [heatmap, setHeatmap] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchHeatmap = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/market/heatmap`, { credentials: 'include' });
      const json = await r.json();
      if (json.success) {
        setHeatmap(json.heatmap);
        setLastUpdated(new Date());
      }
    } catch (_) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!state.heatmapOpen) return;
    setLoading(true);
    fetchHeatmap();
    const interval = setInterval(fetchHeatmap, 10000);
    return () => clearInterval(interval);
  }, [state.heatmapOpen, fetchHeatmap]);

  if (!state.heatmapOpen) return null;

  const close = () => dispatch({ type: 'SET_HEATMAP', payload: false });

  return (
    <div className="heatmap-overlay" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="heatmap-panel">
        <div className="heatmap-header">
          <span className="heatmap-title-icon">🔥</span>
          <span className="heatmap-title-text">Market Heatmap</span>
          {lastUpdated && (
            <span className="heatmap-updated">
              {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
          <button className="heatmap-close" onClick={close} title="Close">✕</button>
        </div>

        <div className="heatmap-legend">
          {[
            { label: '> +3%', color: '#00c853' },
            { label: '+2%',   color: '#00b248' },
            { label: '+1%',   color: '#00963d' },
            { label: '0%',    color: '#1b5e20' },
            { label: '-1%',   color: '#9b1212' },
            { label: '-2%',   color: '#c01515' },
            { label: '< -3%', color: '#e53935' },
          ].map(l => (
            <div key={l.label} className="legend-item">
              <span className="legend-swatch" style={{ background: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        <div className="heatmap-body">
          {loading ? (
            <div className="heatmap-loading">Loading market data…</div>
          ) : (
            SECTOR_ORDER.map(sector => {
              const stocks = heatmap[sector];
              if (!stocks || stocks.length === 0) return null;
              return (
                <div key={sector} className="heatmap-sector">
                  <div className="heatmap-sector-title">{sector}</div>
                  <div className="heatmap-tiles">
                    {stocks.map(stock => (
                      <div
                        key={stock.symbol}
                        className={`heatmap-tile${!stock.available ? ' heatmap-tile--na' : ''}`}
                        style={{ background: stock.available ? getTileColor(stock.pct_change) : '#2a2a2a' }}
                        title={`${stock.symbol}  ${stock.available ? `₹${stock.ltp.toFixed(2)}  ${stock.pct_change >= 0 ? '+' : ''}${stock.pct_change.toFixed(2)}%` : 'No data'}`}
                      >
                        <div className="tile-symbol">{stock.symbol}</div>
                        {stock.available ? (
                          <>
                            <div className="tile-pct">{stock.pct_change >= 0 ? '+' : ''}{stock.pct_change.toFixed(2)}%</div>
                            <div className="tile-ltp">
                              {stock.ltp > 0
                                ? stock.ltp >= 10000
                                  ? stock.ltp.toFixed(0)
                                  : stock.ltp >= 1000
                                    ? stock.ltp.toFixed(1)
                                    : stock.ltp.toFixed(2)
                                : '--'}
                            </div>
                          </>
                        ) : (
                          <div className="tile-na">N/A</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
