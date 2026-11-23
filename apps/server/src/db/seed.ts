import crypto from 'crypto';
import { getDb } from './connection.js';
import { initializeDatabase } from './schema.js';

export function seedDatabase() {
  initializeDatabase();
  const db = getDb();

  // Check if already seeded
  const existingAccounts = db.prepare('SELECT count(*) as count FROM accounts').get() as { count: number };
  if (existingAccounts.count > 0) {
    console.log('ℹ️ Database already contains data. Skipping seed.');
    return;
  }

  console.log('🌱 Seeding initial financial data, accounts, and sample transactions...');

  // 1. Chart of Accounts
  const insertAccount = db.prepare(`
    INSERT INTO accounts (id, code, name, type, currency)
    VALUES (?, ?, ?, ?, ?)
  `);

  const accounts = [
    { id: 'acc_cash', code: '1010', name: 'Cash on Hand', type: 'ASSET' },
    { id: 'acc_bank', code: '1020', name: 'Bank Business Account', type: 'ASSET' },
    { id: 'acc_ar', code: '1200', name: 'Accounts Receivable (Udhar)', type: 'ASSET' },
    { id: 'acc_ap', code: '2010', name: 'Accounts Payable', type: 'LIABILITY' },
    { id: 'acc_equity', code: '3010', name: "Owner's Capital", type: 'EQUITY' },
    { id: 'acc_sales', code: '4010', name: 'Product Sales Revenue', type: 'REVENUE' },
    { id: 'acc_services', code: '4020', name: 'Service Fees Revenue', type: 'REVENUE' },
    { id: 'acc_software', code: '5010', name: 'Software & Tools Expense', type: 'EXPENSE' },
    { id: 'acc_marketing', code: '5020', name: 'Marketing & Ads Expense', type: 'EXPENSE' },
    { id: 'acc_contractors', code: '5030', name: 'Contractors & Freelancers Expense', type: 'EXPENSE' },
    { id: 'acc_utilities', code: '5040', name: 'Utilities & Bills Expense', type: 'EXPENSE' },
    { id: 'acc_misc', code: '5050', name: 'Miscellaneous Office Expense', type: 'EXPENSE' },
    { id: 'acc_entertainment', code: '5060', name: 'Entertainment & Food Expense', type: 'EXPENSE' },
    { id: 'acc_extra', code: '5070', name: 'Extra Operational Costs', type: 'EXPENSE' },
  ];

  for (const acc of accounts) {
    insertAccount.run(acc.id, acc.code, acc.name, acc.type, 'USD');
  }

  // 2. Parties (including the 2 Bilals for disambiguation demonstration!)
  const insertParty = db.prepare(`
    INSERT INTO parties (id, name, phone, tag, current_balance, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const parties = [
    { id: 'pty_bilal_elec', name: 'Bilal', phone: '0300-1122334', tag: 'Electrician', current_balance: 1500.0, notes: 'Electrical contractor' },
    { id: 'pty_bilal_cloth', name: 'Bilal', phone: '0321-4455667', tag: 'Cloth Merchant', current_balance: 12000.0, notes: 'Fabric wholesaler' },
    { id: 'pty_pixel', name: 'Pixel Studio', phone: '0333-7788990', tag: 'Client', current_balance: 2300.0, notes: 'Design agency' },
    { id: 'pty_nova', name: 'NovaTech ILC', phone: '0312-9988776', tag: 'Client', current_balance: 4500.0, notes: 'SaaS development' },
    { id: 'pty_bluetech', name: 'BlueOcean Ltd', phone: '0345-6677889', tag: 'Client', current_balance: 3200.0, notes: 'Mobile App client' },
    { id: 'pty_google_ads', name: 'Google Ads', phone: '', tag: 'Vendor', current_balance: 0.0, notes: 'Ad spend' },
    { id: 'pty_freelancer', name: 'UI Freelancer', phone: '0301-2233445', tag: 'Contractor', current_balance: 0.0, notes: 'Frontend contractor' },
  ];

  for (const p of parties) {
    insertParty.run(p.id, p.name, p.phone, p.tag, p.current_balance, p.notes);
  }

  // 3. Invoices (Matching the user's reference image!)
  const insertInvoice = db.prepare(`
    INSERT INTO invoices (id, invoice_number, party_id, service_description, amount, status, issue_date, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const invoices = [
    { id: 'inv_10021', num: 'INV-10021', party: 'pty_pixel', service: 'Branding Design', amount: 2300.0, status: 'PAID', issue: '2026-08-01', due: '2026-08-05' },
    { id: 'inv_10022', num: 'INV-10022', party: 'pty_nova', service: 'Mobile App UI', amount: 4500.0, status: 'PENDING', issue: '2026-08-05', due: '2026-08-12' },
    { id: 'inv_10023', num: 'INV-10023', party: 'pty_bluetech', service: 'Web Redesign', amount: 3200.0, status: 'OVERDUE', issue: '2026-07-20', due: '2026-08-01' },
  ];

  for (const inv of invoices) {
    insertInvoice.run(inv.id, inv.num, inv.party, inv.service, inv.amount, inv.status, inv.issue, inv.due);
  }

  // 4. Sample Transactions (producing the exact KPIs: Revenue $12,450, Expenses $7,820, Profit $4,630)
  const insertTx = db.prepare(`
    INSERT INTO transactions (id, date, description, source_channel, raw_input, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertEntry = db.prepare(`
    INSERT INTO ledger_entries (id, transaction_id, account_id, party_id, debit, credit, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  function recordSampleTx(
    desc: string,
    channel: 'WHATSAPP_VOICE' | 'WHATSAPP_IMAGE' | 'WHATSAPP_TEXT' | 'WEB_MANUAL',
    raw: string,
    debitAcc: string,
    creditAcc: string,
    amount: number,
    partyId?: string,
    dateOffsetDays: number = 0
  ) {
    const txId = 'tx_' + crypto.randomUUID();
    const txDate = new Date(Date.now() - dateOffsetDays * 86400000).toISOString();
    insertTx.run(txId, txDate, desc, channel, raw, 'POSTED');

    // Debit line
    insertEntry.run('entry_' + crypto.randomUUID(), txId, debitAcc, partyId || null, amount, 0.0, desc);
    // Credit line
    insertEntry.run('entry_' + crypto.randomUUID(), txId, creditAcc, partyId || null, 0.0, amount, desc);
  }

  // Revenues (Total = $12,450)
  recordSampleTx('Branding Project Milestone 1', 'WHATSAPP_TEXT', 'Received 5450 from Pixel Studio for branding', 'acc_bank', 'acc_services', 5450, 'pty_pixel', 10);
  recordSampleTx('E-Commerce Strategy Retainer', 'WHATSAPP_VOICE', 'Client sent 4000 cash for retainer', 'acc_cash', 'acc_sales', 4000, 'pty_nova', 5);
  recordSampleTx('Design System Handover', 'WEB_MANUAL', 'Design System milestone completed', 'acc_bank', 'acc_services', 3000, 'pty_bluetech', 2);

  // Expenses (Total = $7,820 matching the categories in reference image)
  recordSampleTx('Figma and Cloud Hosting', 'WHATSAPP_IMAGE', 'Receipt image: Cloud subscriptions 2100', 'acc_software', 'acc_bank', 2100, undefined, 12);
  recordSampleTx('Google Ads Campaign', 'WHATSAPP_TEXT', 'Google ads marketing charge 1500', 'acc_marketing', 'acc_bank', 1500, 'pty_google_ads', 7);
  recordSampleTx('Backend Developer Payout', 'WHATSAPP_VOICE', 'Transferred 1400 to backend contractor Nasir', 'acc_contractors', 'acc_bank', 1400, 'pty_freelancer', 3);
  recordSampleTx('UI Freelancer Payment', 'WHATSAPP_TEXT', 'Paid 1800 to frontend freelancer', 'acc_contractors', 'acc_bank', 1800, 'pty_freelancer', 1);
  recordSampleTx('Office Stationery & Supplies', 'WHATSAPP_IMAGE', 'Receipt photo: Paper and stationery 1020', 'acc_misc', 'acc_cash', 1020, undefined, 4);

  console.log('✅ Sample data seeded successfully: Total Revenue $12,450, Expenses $7,820, Net Profit $4,630');
}
