import React from 'react';
import { Search, Bell, Sparkles, Plus, Moon, Sun, ChevronDown } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface HeaderProps {
  onOpenAgentModal: () => void;
  onOpenNewPaymentModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  onNavigateToSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAgentModal,
  onOpenNewPaymentModal,
  darkMode,
  setDarkMode,
  activeTab,
  onNavigateToSettings,
}) => {
  const { profile, currency, currencySymbol } = useCurrency();

  const titles: Record<string, { title: string; subtitle: string }> = {
    business: { title: 'Business Finance', subtitle: 'Manage your invoices, expenses, and taxes' },
    dashboard: { title: 'Dashboard Overview', subtitle: 'Real-time operational liquidity and performance' },
    transactions: { title: 'Transactions Ledger', subtitle: 'Double-entry journal records and receipts' },
    wallet: { title: 'My Wallet & Khata', subtitle: 'Receivables and supplier payables' },
    invoices: { title: 'Invoices & Billing', subtitle: 'Client invoices and due payment tracking' },
    reports: { title: 'Financial Reports', subtitle: 'Auditable balance sheets, P&L, and tax statements' },
    settings: { title: 'System Settings', subtitle: 'Currency units, merchant profile, and WhatsApp bridge' },
    help: { title: 'Help Center', subtitle: 'Documentation, guides, and WhatsApp agent setup' },
  };

  const current = titles[activeTab] || titles.business;

  return (
    <header className="bg-white dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border px-8 py-4 transition-colors">
      {/* Top Search, Currency Badge, Theme & Profile Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-[#F8F9FA] dark:bg-dark-card border border-slate-200/80 dark:border-dark-border rounded-xl pl-10 pr-12 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] font-semibold text-slate-400 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border px-1.5 py-0.5 rounded-md shadow-2xs">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Currency Indicator Button (Click to change) */}
          <button
            onClick={onNavigateToSettings}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200/80 dark:border-dark-border text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 transition-all"
            title="Current Accounting Unit. Click to change."
          >
            <span className="text-[10px] text-slate-400">Unit:</span>
            <span className="text-emerald-600 dark:text-emerald-400">{currency}</span>
            <span className="text-[10px] text-slate-500">({currencySymbol})</span>
          </button>

          {/* Theme Toggle (Light / Dark Mode) */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-card transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Assistant Trigger Button */}
          <button
            onClick={onOpenAgentModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold transition-all shadow-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistant</span>
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-xl border border-slate-200 dark:border-dark-border flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-card transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile matching Image 0 & 2 */}
          <button
            onClick={onNavigateToSettings}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-dark-border hover:opacity-85 transition-opacity text-left"
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                {profile.name || 'Esther Howard'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium block">
                {profile.business_name || 'Admin'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>
        </div>
      </div>

      {/* Page Title & Action Button Row */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{current.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{current.subtitle}</p>
        </div>

        <button
          onClick={onOpenNewPaymentModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-sm shadow-emerald-500/25 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Payment</span>
        </button>
      </div>
    </header>
  );
};
