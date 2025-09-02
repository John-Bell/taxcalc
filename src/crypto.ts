const enc = new TextEncoder();
const dec = new TextDecoder();

async function deriveKey(passphrase: string, salt: Uint8Array, iterations: number) {
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

export async function encrypt<T>(data: T, passphrase: string, iterations = 310000): Promise<ArrayBuffer> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(passphrase, salt, iterations);
    const plaintext = enc.encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
    const header = JSON.stringify({
        v: 1,
        kdf: { algo: 'PBKDF2-SHA256', iter: iterations, salt: Array.from(salt) },
        iv: Array.from(iv),
    });
    const headerBytes = enc.encode(header + '\n');
    const out = new Uint8Array(headerBytes.length + ciphertext.byteLength);
    out.set(headerBytes, 0);
    out.set(new Uint8Array(ciphertext), headerBytes.length);
    return out.buffer;
}

export async function decrypt<T>(envelope: ArrayBuffer, passphrase: string): Promise<T> {
    const bytes = new Uint8Array(envelope);
    const newline = bytes.indexOf(10); // \n
    if (newline === -1) throw new Error('Invalid envelope');
    const headerStr = dec.decode(bytes.slice(0, newline));
    const header = JSON.parse(headerStr);
    if (header.v !== 1) throw new Error('Unsupported version');
    const salt = new Uint8Array(header.kdf.salt);
    const iv = new Uint8Array(header.iv);
    const iterations = header.kdf.iter;
    const key = await deriveKey(passphrase, salt, iterations);
    const ciphertext = bytes.slice(newline + 1);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return JSON.parse(dec.decode(plaintext)) as T;
}
