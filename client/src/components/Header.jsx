import { useState } from 'react';

/**
 * Header — App branding with animated gradient title
 */
export default function Header() {
  const [pulse, setPulse] = useState(false);

  return (
    <header className="app-header">
      <div className="header-content">
        <div
          className={`header-icon ${pulse ? 'pulse' : ''}`}
          onMouseEnter={() => setPulse(true)}
          onAnimationEnd={() => setPulse(false)}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#grad)" strokeWidth="2.5" fill="none" />
            <path d="M13 20h14M20 13v14" stroke="url(#grad)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="20" cy="20" r="4" fill="url(#grad)" opacity="0.6" />
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#00ff88" />
                <stop offset="1" stopColor="#00b4d8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="header-title">Cipher Converter</h1>
          <p className="header-subtitle">Encrypt & Decrypt with Classical and Modern Ciphers</p>
        </div>
      </div>
      <div className="header-badge">
        <span className="badge-dot"></span>
        <span>Live</span>
      </div>
    </header>
  );
}
