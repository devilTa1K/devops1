/**
 * Constants for the Cipher Converter application
 */

export const CIPHER_TYPES = [
  {
    id: 'caesar',
    name: 'Caesar Cipher',
    icon: '🏛️',
    description: 'Shifts each letter by a fixed number of positions in the alphabet.',
    keyLabel: 'Shift (number)',
    keyPlaceholder: '3',
    keyRequired: false,
    category: 'Classical',
  },
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    icon: '🔑',
    description: 'Uses a keyword to shift letters with polyalphabetic substitution.',
    keyLabel: 'Keyword',
    keyPlaceholder: 'SECRET',
    keyRequired: true,
    category: 'Classical',
  },
  {
    id: 'base64',
    name: 'Base64 Encoding',
    icon: '📦',
    description: 'Encodes binary data into ASCII text using 64 printable characters.',
    keyLabel: null,
    keyPlaceholder: null,
    keyRequired: false,
    category: 'Encoding',
  },
  {
    id: 'aes',
    name: 'AES Encryption',
    icon: '🛡️',
    description: 'Advanced Encryption Standard — military-grade symmetric encryption.',
    keyLabel: 'Secret Key',
    keyPlaceholder: 'my-secret-key',
    keyRequired: false,
    category: 'Modern',
  },
];

export const getCipherById = (id) => CIPHER_TYPES.find(c => c.id === id);
