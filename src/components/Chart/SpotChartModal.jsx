import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import LightweightChart from './LightweightChart';
import './Chart.css';

const TIMEFRAMES = [1, 3, 5];

export default function SpotChartModal() {
  const { state, dispatch } = useApp();
  const [timeframe, setTimeframe] = useState(5);

  if (!state.chartModalOpen) return null;

  const close = () => dispatch({ type: 'SET_CHART_MODAL', payload: false });

  return (
    <>
      <div className="chart-modal-backdrop" onClick={close} />
      <div className="chart-modal">
        <div className="chart-modal-header">
          <span className="chart-modal-title">
            {state.currentSymbol} &nbsp;|&nbsp; {state.currentDataDate}
          </span>
          <div className="chart-tf-group">
            {TIMEFRAMES.map(tf => (
              <button
                key={tf}
                className={`chart-tf-btn${timeframe === tf ? ' active' : ''}`}
                onClick={() => setTimeframe(tf)}
              >
                {tf}m
              </button>
            ))}
          </div>
          <button className="chart-modal-close" onClick={close}>✕</button>
        </div>
        <div className="chart-modal-body">
          <LightweightChart
            symbol={state.currentSymbol}
            expiry={state.currentExpiry}
            date={state.currentDataDate}
            historicalMode={state.historicalMode}
            cutoffTime={state.historicalMode ? state.currentTime : null}
            timeframe={timeframe}
          />
        </div>
      </div>
    </>
  );
}
