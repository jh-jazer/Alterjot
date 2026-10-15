/**
 * CryptoVaultService
 * Provides client-side, zero-knowledge AES-256-GCM authenticated encryption
 * for synchronizing API keys securely to the cloud.
 */

// Helper to convert ArrayBuffer <-> Base64
function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export interface EncryptedPayload {
  v: number; // version
  s: string; // salt (base64)
  iv: string; // initialization vector (base64)
  d: string; // encrypted data ciphertext + tag (base64)
}

/**
 * Derives an AES-GCM 256-bit key from a user secret using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export const cryptoVault = {
  /**
   * Generates a device-agnostic encryption passphrase for the authenticated user
   */
  getUserPassphrase(userId: string, email?: string): string {
    const cleanId = (userId || 'alterjot_author_vault').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    return `alterjot:vault:v1:${cleanId}:${cleanEmail}`;
  },

  /**
   * Generates ordered candidate decryption passphrases for maximum device-to-device resilience.
   * Ensures vaults created under guest mode, Google ID, or different device sessions decrypt seamlessly.
   */
  getUserPassphraseCandidates(userId: string, email?: string, googleId?: string): string[] {
    const cleanId = (userId || '').trim();
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanGoogleId = (googleId || '').trim();

    const candidates: string[] = [];

    // 1. Primary standard passphrase (current session userId:email)
    if (cleanId) {
      candidates.push(`alterjot:vault:v1:${cleanId}:${cleanEmail}`);
    }

    // 2. Google ID based passphrase (if different from userId)
    if (cleanGoogleId && cleanGoogleId !== cleanId) {
      candidates.push(`alterjot:vault:v1:${cleanGoogleId}:${cleanEmail}`);
      candidates.push(`alterjot:vault:v1:${cleanGoogleId}:`);
    }

    // 3. Email-only based passphrases (universal across all user's devices)
    if (cleanEmail) {
      candidates.push(`alterjot:vault:v1:${cleanEmail}:${cleanEmail}`);
      candidates.push(`alterjot:vault:v1:author_default:${cleanEmail}`);
      candidates.push(`alterjot:vault:v2:${cleanEmail}`);
    }

    // 4. Fallback default/guest passphrases
    candidates.push(`alterjot:vault:v1:author_default:`);
    candidates.push(`alterjot:vault:v1:alterjot_author_vault:`);
    if (cleanId) {
      candidates.push(`alterjot:vault:v1:${cleanId}:`);
    }

    return Array.from(new Set(candidates.filter(Boolean)));
  },

  /**
   * Encrypts arbitrary data (e.g. API Vault array) using AES-256-GCM
   */
  async encrypt(data: any, passphrase: string): Promise<string> {
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      throw new Error('Web Cryptography API is not available in this environment');
    }

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt);

    const enc = new TextEncoder();
    const plaintext = enc.encode(JSON.stringify(data));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      plaintext
    );

    const payload: EncryptedPayload = {
      v: 1,
      s: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      d: bufferToBase64(ciphertext),
    };

    return JSON.stringify(payload);
  },

  /**
   * Decrypts an AES-256-GCM encrypted payload back into original data.
   * Supports passing a single passphrase or an array of candidate passphrases.
   */
  async decrypt<T = any>(encryptedString: string, passphraseOrCandidates: string | string[]): Promise<T | null> {
    if (!encryptedString || typeof encryptedString !== 'string') return null;
    if (typeof window === 'undefined' || !window.crypto?.subtle) {
      throw new Error('Web Cryptography API is not available in this environment');
    }

    const passphrases = Array.isArray(passphraseOrCandidates)
      ? passphraseOrCandidates
      : [passphraseOrCandidates];

    try {
      const payload: EncryptedPayload = JSON.parse(encryptedString);
      if (!payload.s || !payload.iv || !payload.d) {
        return null;
      }

      const salt = base64ToBuffer(payload.s);
      const iv = base64ToBuffer(payload.iv);
      const ciphertext = base64ToBuffer(payload.d);

      for (const pass of passphrases) {
        try {
          const key = await deriveKey(pass, salt);
          const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv as any },
            key,
            ciphertext as any
          );

          const dec = new TextDecoder();
          const jsonString = dec.decode(decryptedBuffer);
          return JSON.parse(jsonString) as T;
        } catch {
          // Continue to next candidate passphrase
        }
      }

      console.warn('[CryptoVault] Decryption failed for all candidate passphrases');
      return null;
    } catch (err) {
      console.warn('[CryptoVault] Decryption failed (invalid passphrase or corrupted payload):', err);
      return null;
    }
  },
};
