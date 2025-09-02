import { db } from './db';
import { encrypt, decrypt } from './crypto';
import { parseVault } from './schema';
import type { VaultV1 } from './model';

export async function saveVault(vault: VaultV1, passphrase: string): Promise<void> {
    const envelope = await encrypt(vault, passphrase);
    await db.vault.put({ id: 'vault', version: 1, updatedAt: Date.now(), envelope });
}

export async function loadVault(passphrase: string): Promise<VaultV1 | null> {
    const rec = await db.vault.get('vault');
    if (!rec) return null;
    const data = await decrypt<VaultV1>(rec.envelope, passphrase);
    return parseVault(data);
}

export async function exportEnvelope(): Promise<ArrayBuffer | null> {
    const rec = await db.vault.get('vault');
    return rec?.envelope ?? null;
}

export async function importEnvelope(buf: ArrayBuffer, passphrase: string, verifyOnly = false): Promise<VaultV1> {
    const data = await decrypt<VaultV1>(buf, passphrase);
    const vault = parseVault(data);
    if (!verifyOnly) {
        await db.vault.put({ id: 'vault', version: 1, updatedAt: Date.now(), envelope: buf });
    }
    return vault;
}
