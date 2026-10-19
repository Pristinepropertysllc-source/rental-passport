import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// SSNs are stored encrypted with AES-256-GCM as "enc:v1:<iv>:<tag>:<ciphertext>" (base64 parts).
// The key comes from SSN_ENCRYPTION_KEY: 32 random bytes, base64-encoded
// (generate one with `openssl rand -base64 32`). Values without the prefix are older
// plaintext rows; they are still readable and get encrypted on the next save or by
// scripts/encrypt-ssns.mjs.

const PREFIX = 'enc:v1:';

function getKey(): Buffer | null {
  const raw = process.env.SSN_ENCRYPTION_KEY;
  if (!raw) return null;
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('SSN_ENCRYPTION_KEY must be 32 bytes, base64-encoded');
  return key;
}

export function isEncryptedSsn(value: string | null | undefined): boolean {
  return !!value && value.startsWith(PREFIX);
}

/** Encrypts an SSN for storage. Without a key configured it returns the value unchanged. */
export function encryptSsn(value: string): string {
  if (!value || isEncryptedSsn(value)) return value;
  const key = getKey();
  if (!key) {
    console.warn('SSN_ENCRYPTION_KEY is not set; storing SSN unencrypted');
    return value;
  }
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + [iv, tag, ct].map((b) => b.toString('base64')).join(':');
}

/** Returns the plain SSN, or null if it can't be decrypted. */
export function decryptSsn(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!isEncryptedSsn(value)) return value;
  const key = getKey();
  if (!key) return null;
  try {
    const [iv, tag, ct] = value.slice(PREFIX.length).split(':').map((p) => Buffer.from(p, 'base64'));
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

/** "***-**-1234" for display to landlords and on printouts. */
export function maskSsn(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isEncryptedSsn(value)) {
    const plain = decryptSsn(value);
    if (!plain) return 'On file';
    value = plain;
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length < 4) return 'On file';
  return `***-**-${digits.slice(-4)}`;
}
