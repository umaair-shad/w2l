import { Router } from 'express';
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

// 1. Get KPI Cards (Revenue, Expenses, Net Profit, Pending Invoices)
dashboardRouter.get('/kpis', (req, res) => {
  try {
    const kpis = getDashboardKpis();
    res.json(kpis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Get Revenue Overview Chart
dashboardRouter.get('/revenue-overview', (req, res) => {
  try {
    const overview = getRevenueOverview();
    res.json(overview);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get Expense Category Breakdown
dashboardRouter.get('/expense-breakdown', (req, res) => {
  try {
    const breakdown = getExpenseBreakdown();
    res.json(breakdown);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Invoices
dashboardRouter.get('/invoices', (req, res) => {
  try {
    const invoices = getRecentInvoices();
    res.json(invoices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Get Recent Transactions
dashboardRouter.get('/transactions', (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const transactions = getRecentTransactions(limit);
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Manual New Transaction from Dashboard
dashboardRouter.post('/transactions', (req, res) => {
  try {
    const { type, amount, category, payment_method, party_id, description } = req.body;
    const tx = recordLedgerTransaction({
      type: type || 'EXPENSE',
      amount: parseFloat(amount),
      category: category || 'Misc',
      payment_method: payment_method || 'CASH',
      party_id,
      description: description || `${type} of $${amount}`,
      source_channel: 'WEB_MANUAL',
    });
    res.json({ success: true, transaction: tx });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Search Parties
dashboardRouter.get('/parties', (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const parties = findPartiesByName(q);
    res.json(parties);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
