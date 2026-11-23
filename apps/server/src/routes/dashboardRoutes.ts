import { Router } from 'express';
import { getDb } from '../db/connection.js';
import {
  getDashboardKpis,
  getRevenueOverview,
  getExpenseBreakdown,
  getRecentInvoices,
  getRecentTransactions,
  recordLedgerTransaction,
} from '../ledger/engine.js';
import { findPartiesByName } from '../ledger/partyManager.js';

export const dashboardRouter = Router();

// 1. Get User Profile & Currency Settings
dashboardRouter.get('/profile', (req, res) => {
  try {
    const db = getDb();
    let profile = db.prepare('SELECT * FROM user_profile LIMIT 1').get() as any;
    if (!profile) {
      profile = {
        name: 'Esther Howard',
        business_name: 'W2L Business Commerce',
        email: 'esther@w2l.internal',
        phone: '+92 300 1234567',
        currency: 'PKR',
        currency_symbol: 'Rs',
        theme: 'light',
      };
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Update User Profile & Currency (e.g. Switch to PKR, USD, EUR, etc.)
dashboardRouter.put('/profile', (req, res) => {
  try {
    const db = getDb();
    const { name, business_name, email, phone, currency, currency_symbol, theme } = req.body;

    const symbolMap: Record<string, string> = {
      PKR: 'Rs',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AED: 'AED',
      SAR: 'SAR',
      INR: '₹',
    };

    const finalSymbol = currency_symbol || symbolMap[currency] || 'Rs';

    db.prepare(`
      UPDATE user_profile 
      SET name = COALESCE(?, name),
          business_name = COALESCE(?, business_name),
          email = COALESCE(?, email),
          phone = COALESCE(?, phone),
          currency = COALESCE(?, currency),
          currency_symbol = COALESCE(?, currency_symbol),
          theme = COALESCE(?, theme),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = 'usr_default'
    `).run(name, business_name, email, phone, currency, finalSymbol, theme);

    const updated = db.prepare('SELECT * FROM user_profile WHERE id = \'usr_default\'').get();
    res.json({ success: true, profile: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get KPI Cards
dashboardRouter.get('/kpis', (req, res) => {
  try {
    const kpis = getDashboardKpis();
    res.json(kpis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Revenue Overview Chart
dashboardRouter.get('/revenue-overview', (req, res) => {
  try {
    const overview = getRevenueOverview();
    res.json(overview);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Expense Category Breakdown
dashboardRouter.get('/expense-breakdown', (req, res) => {
  try {
    const breakdown = getExpenseBreakdown();
    res.json(breakdown);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Get Invoices
dashboardRouter.get('/invoices', (req, res) => {
  try {
    const invoices = getRecentInvoices();
    res.json(invoices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Recent Transactions
dashboardRouter.get('/transactions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const transactions = getRecentTransactions(limit);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Manual New Transaction from Dashboard
dashboardRouter.post('/transactions', (req, res) => {
  try {
    const { type, amount, category, payment_method, party_id, description } = req.body;
    const tx = recordLedgerTransaction({
      type: type || 'EXPENSE',
      amount: parseFloat(amount),
      category: category || 'Misc',
      payment_method: payment_method || 'CASH',
      party_id,
      description: description || `${type} of ${amount}`,
      source_channel: 'WEB_MANUAL',
    });
    res.json({ success: true, transaction: tx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Search Parties
dashboardRouter.get('/parties', (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const parties = findPartiesByName(q);
    res.json(parties);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
