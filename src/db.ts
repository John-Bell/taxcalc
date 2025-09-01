import Dexie, { Table } from 'dexie';

export interface AppStateRecord {
  id: string;
  data: unknown;
}

class AppDB extends Dexie {
  appState!: Table<AppStateRecord, string>;

  constructor() {
    super('app-db');
    this.version(1).stores({
      appState: '&id',
    });
  }
}

export const db = new AppDB();
