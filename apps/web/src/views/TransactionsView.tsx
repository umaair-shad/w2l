import React, { useState, useEffect } from 'react';
import { Search, Filter, Mic, Image as ImageIcon, MessageSquare, Plus, Download } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/dashboard/transactions?limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTransactions(data);
      })
      .catch(() => {});
  }, []);

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.party_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.account_name?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'ALL') return matchesSearch;
    if (filterType === 'INCOME') return matchesSearch && tx.credit > 0;
    if (filterType === 'EXPENSE') return matchesSearch && tx.debit > 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Transactions & Double-Entry Ledger
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of entries captured via WhatsApp voice, receipts, and manual logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800">
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/90 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memo, party, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'INCOME', 'EXPENSE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === t
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-border'
              }`}
            >
              {t === 'ALL' ? 'All Entries' : t === 'INCOME' ? 'Income / Sales' : 'Expenses'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-dark-border text-[11px] font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-dark-surface/50">
                <th className="py-3.5 px-4 font-semibold">Date & Time</th>
                <th className="py-3.5 px-4 font-semibold">Channel</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
                <th className="py-3.5 px-4 font-semibold">Party / Khata</th>
                <th className="py-3.5 px-4 font-semibold">Account</th>
                <th className="py-3.5 px-4 font-semibold text-right">Debit (Exp)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Credit (Inc)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const channelBadge = {
                    WHATSAPP_VOICE: { label: 'Voice Note', icon: Mic, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' },
                    WHATSAPP_IMAGE: { label: 'Receipt OCR', icon: ImageIcon, color: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400' },
                    WHATSAPP_TEXT: { label: 'WhatsApp', icon: MessageSquare, color: 'text-teal-700 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400' },
                    WEB_MANUAL: { label: 'Manual', icon: Plus, color: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
                  }[tx.source_channel as string] || { label: 'Web', icon: Plus, color: 'text-slate-700 bg-slate-100' };

                  const ChannelIcon = channelBadge.icon;

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[10px] ${channelBadge.color}`}>
                          <ChannelIcon className="w-3 h-3" />
                          <span>{channelBadge.label}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4">
                        {tx.party_name ? (
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white block">{tx.party_name}</span>
                            {tx.party_tag && <span className="text-[10px] text-slate-400">{tx.party_tag}</span>}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        {tx.account_name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-right text-rose-500">
                        {tx.debit > 0 ? `$${tx.debit.toLocaleString()}` : '—'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-right text-emerald-600 dark:text-emerald-400">
                        {tx.credit > 0 ? `$${tx.credit.toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
