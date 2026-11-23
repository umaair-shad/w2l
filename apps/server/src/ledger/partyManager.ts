import { getDb } from '../db/connection.js';

export interface PartyMatch {
  id: string;
  name: string;
  phone?: string;
  tag?: string;
  current_balance: number;
}

export function findPartiesByName(queryName: string): PartyMatch[] {
  const db = getDb();
  const normalized = queryName.trim().toLowerCase();

  const stmt = db.prepare(`
    SELECT id, name, phone, tag, current_balance
    FROM parties
    WHERE LOWER(name) LIKE ? OR LOWER(tag) LIKE ?
  `);

  const results = stmt.all(`%${normalized}%`, `%${normalized}%`) as PartyMatch[];
  return results;
}

export function getPartyById(partyId: string): PartyMatch | null {
  const db = getDb();
  const stmt = db.prepare('SELECT id, name, phone, tag, current_balance FROM parties WHERE id = ?');
  const result = stmt.get(partyId) as PartyMatch | undefined;
  return result || null;
}

export function createParty(name: string, phone: string = '', tag: string = '', initialBalance: number = 0): PartyMatch {
  const db = getDb();
  const id = 'pty_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  
  const stmt = db.prepare(`
    INSERT INTO parties (id, name, phone, tag, current_balance)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, name, phone, tag, initialBalance);

  return { id, name, phone, tag, current_balance: initialBalance };
}
