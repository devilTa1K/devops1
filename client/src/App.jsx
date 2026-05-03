import { useState } from 'react';
import Header from './components/Header';
import CipherForm from './components/CipherForm';
import OutputDisplay from './components/OutputDisplay';
import HistoryPanel from './components/HistoryPanel';
import './index.css';

/**
 * App — Root component for Cipher Converter
 */
export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleResult = (data) => {
    setResult(data);
    // Trigger history refresh
    setRefreshHistory((prev) => prev + 1);
  };

  return (
    <div className="app">
      {/* Animated background particles */}
      <div className="bg-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      <div className="app-container">
        <Header />

        <main className="main-content">
          <div className="content-grid">
            {/* Left Column: Form + Output */}
            <div className="primary-column">
              <CipherForm
                onResult={handleResult}
                setLoading={setLoading}
                loading={loading}
              />
              <OutputDisplay result={result} />
            </div>

            {/* Right Column: History */}
            <div className="secondary-column">
              <HistoryPanel refreshTrigger={refreshHistory} />
            </div>
          </div>
        </main>

        <footer className="app-footer">
          <p>
            🔐 Cipher Converter &copy; {new Date().getFullYear()} — Built with
            React, Express, MongoDB & Docker
          </p>
        </footer>
      </div>
    </div>
  );
}
