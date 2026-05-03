import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '../api/cipherApi';
import { getCipherById } from '../utils/constants';

/**
 * HistoryPanel — Displays conversion history fetched from the API
 */
export default function HistoryPanel({ refreshTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory(1, 50);
      if (data.success) {
        setHistory(data.data);
      }
    } catch (err) {
      setError('Could not load history');
      console.warn('History fetch failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const handleClear = async () => {
    try {
      await clearHistory();
      setHistory([]);
    } catch {
      setError('Failed to clear history');
    }
  };

  const truncate = (str, len = 40) =>
    str.length > len ? str.substring(0, len) + '…' : str;

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="history-panel">
      <div className="history-header" onClick={() => setExpanded(!expanded)}>
        <h2 className="section-title">
          <span className="section-icon">📜</span>
          History
          {history.length > 0 && (
            <span className="history-count">{history.length}</span>
          )}
        </h2>
        <div className="history-actions">
          {history.length > 0 && (
            <button
              className="btn-clear"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              title="Clear history"
            >
              🗑️ Clear
            </button>
          )}
          <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {expanded && (
        <div className="history-body">
          {loading && (
            <div className="history-loading">
              <span className="spinner">⟳</span> Loading history...
            </div>
          )}

          {error && <div className="history-error">⚠️ {error}</div>}

          {!loading && !error && history.length === 0 && (
            <div className="history-empty">
              <p>No conversions yet. Try encrypting some text!</p>
            </div>
          )}

          {!loading && history.length > 0 && (
            <div className="history-list">
              {history.map((item, i) => {
                const cipher = getCipherById(item.cipherType);
                return (
                  <div key={item._id || i} className="history-item">
                    <div className="history-item-header">
                      <span className={`operation-badge small ${item.operation}`}>
                        {item.operation === 'encrypt' ? '🔒' : '🔓'}
                      </span>
                      <span className="history-cipher">
                        {cipher?.icon} {cipher?.name || item.cipherType}
                      </span>
                      <span className="history-time">{formatTime(item.createdAt)}</span>
                    </div>
                    <div className="history-item-body">
                      <div className="history-text">
                        <span className="text-label">In:</span>
                        <code>{truncate(item.inputText)}</code>
                      </div>
                      <div className="history-arrow">→</div>
                      <div className="history-text">
                        <span className="text-label">Out:</span>
                        <code>{truncate(item.outputText)}</code>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
