const enc = new TextEncoder();
const dec = new TextDecoder();

function bufToBase64(buf: Uint8Array): string {
  let str = '';
  buf.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str);
}

function base64ToBuf(b64: string): Uint8Array {
  const str = atob(b64);
  const buf = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
  return buf;
}

export interface EncryptedPayload {
  version: number;
  iter: number;
  salt: string;
  iv: string;
  data: string;
}

export async function deriveKey(passphrase: string, salt: Uint8Array, iterations = 310000) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptState<T>(state: T, passphrase: string): Promise<EncryptedPayload> {
  const iterations = 310000;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt, iterations);
  const data = enc.encode(JSON.stringify(state));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return {
    version: 1,
    iter: iterations,
    salt: bufToBase64(salt),
    iv: bufToBase64(iv),
    data: bufToBase64(new Uint8Array(ciphertext)),
  };
}

export async function decryptState<T>(payload: EncryptedPayload, passphrase: string): Promise<T> {
  const salt = base64ToBuf(payload.salt);
  const iv = base64ToBuf(payload.iv);
  const ciphertext = base64ToBuf(payload.data);
  const key = await deriveKey(passphrase, salt, payload.iter);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return JSON.parse(dec.decode(decrypted)) as T;
}
