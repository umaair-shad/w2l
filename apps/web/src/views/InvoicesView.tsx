import React, { useState } from 'react';
import { Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface InvoicesViewProps {
  invoices: any[];
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ invoices }) => {
  const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'OVERDUE'>('ALL');
  const [search, setSearch] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === 'ALL' || inv.status === filter;
    const matchesSearch =
      inv.invoice_id?.toLowerCase().includes(search.toLowerCase()) ||
      inv.client?.toLowerCase().includes(search.toLowerCase()) ||
      inv.service?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Client Invoices & Receivables
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track issued billing, due dates, and outstanding credit balances
          </p>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 block">
              Total Outstanding
            </span>
            <span className="text-lg font-extrabold text-emerald-900 dark:text-emerald-300">
              ${totalOutstanding.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/90 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice # or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'PAID', 'PENDING', 'OVERDUE'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === status
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-border'
              }`}
            >
              {status === 'ALL' ? 'All Invoices' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-2xs overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-dark-border text-[11px] font-bold text-slate-400 tracking-wider bg-slate-50/50 dark:bg-dark-surface/50">
              <th className="py-3.5 px-4 font-semibold">Invoice ID</th>
              <th className="py-3.5 px-4 font-semibold">Client</th>
              <th className="py-3.5 px-4 font-semibold">Service Description</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Due Date</th>
              <th className="py-3.5 px-4 font-semibold text-right">Amount</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-dark-border">
            {filteredInvoices.map((inv) => {
              const statusConfig = {
                PAID: { label: 'Paid', icon: CheckCircle2, style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' },
                PENDING: { label: 'Pending', icon: Clock, style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800' },
                OVERDUE: { label: 'Overdue', icon: AlertTriangle, style: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' },
              }[inv.status as 'PAID' | 'PENDING' | 'OVERDUE'] || { label: inv.status, icon: Clock, style: '' };

              const StatusIcon = statusConfig.icon;

              return (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                    {inv.invoice_id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {inv.client}
                    {inv.client_tag && (
                      <span className="text-[10px] text-slate-400 block font-normal">{inv.client_tag}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                    {inv.service}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusConfig.style}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{statusConfig.label}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-medium">
                    {inv.due_date}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white text-right">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
