/**
 * CipherInfo — Displays information about the selected cipher
 */
import { getCipherById } from '../utils/constants';

export default function CipherInfo({ cipherType }) {
  const cipher = getCipherById(cipherType);
  if (!cipher) return null;

  return (
    <div className="cipher-info">
      <span className="cipher-info-icon">{cipher.icon}</span>
      <div>
        <span className="cipher-info-category">{cipher.category}</span>
        <p className="cipher-info-desc">{cipher.description}</p>
      </div>
    </div>
  );
}
