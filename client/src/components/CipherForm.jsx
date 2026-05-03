import { useState } from 'react';
import { CIPHER_TYPES, getCipherById } from '../utils/constants';
import CipherInfo from './CipherInfo';

/**
 * CipherForm — Main input form with cipher selection, text input, and action buttons
 */
export default function CipherForm({ onResult, setLoading, loading }) {
  const [text, setText] = useState('');
  const [cipherType, setCipherType] = useState('caesar');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const selectedCipher = getCipherById(cipherType);

  const handleSubmit = async (operation) => {
    setError('');

    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    if (selectedCipher.keyRequired && !key.trim()) {
      setError(`${selectedCipher.keyLabel} is required for ${selectedCipher.name}`);
      return;
    }

    setLoading(true);
    try {
      const { encryptText, decryptText } = await import('../api/cipherApi');
      const fn = operation === 'encrypt' ? encryptText : decryptText;
      const data = await fn(text, cipherType, key || undefined);

      if (data.success) {
        onResult({
          input: text,
          output: data.result,
          cipherType,
          operation,
          cipherName: selectedCipher.name,
          cipherIcon: selectedCipher.icon,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.join(', ')
        || err.message
        || 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cipher-form-card">
      <h2 className="section-title">
        <span className="section-icon">⌨️</span>
        Input
      </h2>

      {/* Cipher Type Selector */}
      <div className="form-group">
        <label className="form-label">Cipher Type</label>
        <div className="cipher-selector">
          {CIPHER_TYPES.map((cipher) => (
            <button
              key={cipher.id}
              className={`cipher-option ${cipherType === cipher.id ? 'active' : ''}`}
              onClick={() => { setCipherType(cipher.id); setError(''); }}
              type="button"
            >
              <span className="cipher-option-icon">{cipher.icon}</span>
              <span className="cipher-option-name">{cipher.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cipher Info */}
      <CipherInfo cipherType={cipherType} />

      {/* Key/Shift Input */}
      {selectedCipher.keyLabel && (
        <div className="form-group">
          <label className="form-label">
            {selectedCipher.keyLabel}
            {selectedCipher.keyRequired && <span className="required">*</span>}
          </label>
          <input
            type={cipherType === 'caesar' ? 'number' : 'text'}
            className="form-input"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder={selectedCipher.keyPlaceholder}
          />
        </div>
      )}

      {/* Text Input */}
      <div className="form-group">
        <label className="form-label">Text</label>
        <textarea
          className="form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encrypt or decrypt..."
          rows={5}
          maxLength={10000}
        />
        <span className="char-count">{text.length} / 10,000</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-encrypt"
          onClick={() => handleSubmit('encrypt')}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">⟳</span>
          ) : (
            <>🔒 Encrypt</>
          )}
        </button>
        <button
          className="btn btn-decrypt"
          onClick={() => handleSubmit('decrypt')}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">⟳</span>
          ) : (
            <>🔓 Decrypt</>
          )}
        </button>
      </div>
    </div>
  );
}
