import crypto from 'crypto';

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'chord-io-secret-key-must-be-32-chars';
const IV_LENGTH = 16;

function getKey(): Buffer {
  if (process.env.ENCRYPTION_KEY) {
    return Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex').slice(0, 32);
  }

  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey();

  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(text: string): string {
  const [ivHex, encryptedHex] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');
  const key = getKey();

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
