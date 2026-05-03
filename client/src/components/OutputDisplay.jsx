import { useState } from 'react';

/**
 * OutputDisplay — Shows the cipher result with copy-to-clipboard
 */
export default function OutputDisplay({ result }) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="output-card output-empty">
        <div className="output-placeholder">
          <span className="placeholder-icon">🔐</span>
          <p>Your encrypted or decrypted result will appear here</p>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = result.output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="output-card output-filled">
      <div className="output-header">
        <h2 className="section-title">
          <span className="section-icon">📤</span>
          Output
        </h2>
        <div className="output-meta">
          <span className={`operation-badge ${result.operation}`}>
            {result.operation === 'encrypt' ? '🔒' : '🔓'} {result.operation}
          </span>
          <span className="cipher-badge">
            {result.cipherIcon} {result.cipherName}
          </span>
        </div>
      </div>

      <div className="output-content">
        <pre className="output-text">{result.output}</pre>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
      </div>
    </div>
  );
}
