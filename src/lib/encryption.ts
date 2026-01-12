/**
 * Device-fingerprint-based encryption for ICS URLs
 * Uses AES-256-GCM with PBKDF2 key derivation
 */

const PBKDF2_ITERATIONS = 100000;
const ENCRYPTION_SALT_KEY = 'busical_encryption_salt';

export interface EncryptedData {
  encrypted: string;
  iv: string;
  salt: string;
}

/**
 * Check if Web Crypto API is available
 * Returns false for unsupported browsers
 */
export function isWebCryptoSupported(): boolean {
  return !!(window.crypto && window.crypto.subtle);
}

/**
 * Generate device fingerprint from browser characteristics
 * Creates a deterministic string unique to this device
 */
export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    new Date().getTimezoneOffset().toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  ];
  
  return components.join('|');
}

/**
 * Get or create encryption salt
 * Salt is stored in localStorage and reused
 */
function getOrCreateSalt(): string {
  let salt = localStorage.getItem(ENCRYPTION_SALT_KEY);
  if (!salt) {
    // Generate new random salt
    const saltArray = new Uint8Array(16);
    crypto.getRandomValues(saltArray);
    salt = Array.from(saltArray, b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(ENCRYPTION_SALT_KEY, salt);
    console.log('[BusiCal] Generated new encryption salt');
  }
  return salt;
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Derive encryption key from device fingerprint and salt
 */
async function deriveEncryptionKey(fingerprint: string, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const fingerprintBuffer = encoder.encode(fingerprint);
  const saltBuffer = hexToBytes(salt);

  // Import fingerprint as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    fingerprintBuffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt URL using AES-GCM
 * Returns encrypted data with IV and salt
 */
export async function encryptUrl(url: string): Promise<EncryptedData> {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }

  const fingerprint = generateDeviceFingerprint();
  const salt = getOrCreateSalt();
  const key = await deriveEncryptionKey(fingerprint, salt);

  // Generate random IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(url);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    key,
    dataBuffer
  );

  console.log('[BusiCal] URL encrypted successfully');

  return {
    encrypted: bytesToHex(new Uint8Array(encryptedBuffer)),
    iv: bytesToHex(iv),
    salt,
  };
}

/**
 * Decrypt URL from encrypted data
 * Returns null if decryption fails
 */
export async function decryptUrl(encryptedData: EncryptedData): Promise<string | null> {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }

  try {
    const fingerprint = generateDeviceFingerprint();
    const key = await deriveEncryptionKey(fingerprint, encryptedData.salt);

    const encryptedBuffer = hexToBytes(encryptedData.encrypted);
    const iv = hexToBytes(encryptedData.iv);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
      key,
      encryptedBuffer.buffer as ArrayBuffer
    );

    const decoder = new TextDecoder();
    const decrypted = decoder.decode(decryptedBuffer);
    
    console.log('[BusiCal] URL decrypted successfully');
    return decrypted;
  } catch (error) {
    console.error('[BusiCal] Decryption failed:', error);
    return null;
  }
}

/**
 * Check if stored data is in encrypted format
 */
export function isEncrypted(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    return !!(parsed.encrypted && parsed.iv && parsed.salt);
  } catch {
    return false;
  }
}