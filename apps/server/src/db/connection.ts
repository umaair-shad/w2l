import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.js';

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(config.dbPath);
    // Enable WAL mode for high performance concurrent reads and writes
    dbInstance.exec('PRAGMA journal_mode = WAL;');
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}
