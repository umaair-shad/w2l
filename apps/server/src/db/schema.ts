import { getDb } from './connection.js';

export function initializeDatabase() {
  const db = getDb();

  // Create core schema
  db.exec(`
    -- Chart of Accounts
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')) NOT NULL,
      currency TEXT DEFAULT 'USD',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Parties (Customers, Suppliers, Khata Contacts)
    CREATE TABLE IF NOT EXISTS parties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      tag TEXT,
      current_balance REAL DEFAULT 0.0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_parties_name ON parties(name);

    -- Transactions Header
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      date DATETIME NOT NULL,
      description TEXT NOT NULL,
      source_channel TEXT CHECK(source_channel IN ('WHATSAPP_VOICE', 'WHATSAPP_IMAGE', 'WHATSAPP_TEXT', 'WEB_MANUAL')) NOT NULL,
      raw_input TEXT,
      status TEXT DEFAULT 'POSTED' CHECK(status IN ('POSTED', 'VOID', 'DRAFT')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

    -- Double-Entry Lines
    CREATE TABLE IF NOT EXISTS ledger_entries (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      account_id TEXT NOT NULL REFERENCES accounts(id),
      party_id TEXT REFERENCES parties(id),
      debit REAL DEFAULT 0.0 CHECK(debit >= 0),
      credit REAL DEFAULT 0.0 CHECK(credit >= 0),
      memo TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_ledger_tx ON ledger_entries(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_ledger_account ON ledger_entries(account_id);
    CREATE INDEX IF NOT EXISTS idx_ledger_party ON ledger_entries(party_id);

    -- Invoices (Matching Dashboard Table)
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT UNIQUE NOT NULL,
      party_id TEXT NOT NULL REFERENCES parties(id),
      service_description TEXT NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      status TEXT CHECK(status IN ('PAID', 'PENDING', 'OVERDUE')) NOT NULL,
      issue_date DATE NOT NULL,
      due_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

    -- Receipts (OCR & Vision Metadata)
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      transaction_id TEXT REFERENCES transactions(id) ON DELETE SET NULL,
      file_path TEXT NOT NULL,
      file_hash TEXT,
      ocr_raw_text TEXT,
      extracted_total REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Agent Sessions (For Conversational Disambiguation)
    CREATE TABLE IF NOT EXISTS agent_sessions (
      id TEXT PRIMARY KEY,
      user_identifier TEXT NOT NULL,
      state TEXT CHECK(state IN ('IDLE', 'AWAITING_DISAMBIGUATION', 'AWAITING_CONFIRMATION')) NOT NULL,
      pending_payload TEXT,
      expires_at DATETIME NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON agent_sessions(user_identifier);
  `);

  console.log('✅ SQLite Database & Ledger Schema Initialized Successfully');
}
