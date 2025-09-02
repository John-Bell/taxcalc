import Dexie, { Table } from 'dexie';

export interface VaultRecord {
    id: string; // 'vault'
    version: number;
    updatedAt: number;
    envelope: ArrayBuffer;
}

class AppDB extends Dexie {
    vault!: Table<VaultRecord, string>;

    constructor() {
        super('app-db');
        this.version(1).stores({
            vault: '&id',
        });
    }
}

export const db = new AppDB();
