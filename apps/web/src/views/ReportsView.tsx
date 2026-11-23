import React from 'react';
import { Download } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const ReportsView: React.FC = () => {
  const { formatAmount } = useCurrency();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Statements & Tax Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Auditable double-entry balance sheets, P&L, and expense breakdowns
          </p>
        </div>

        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/25">
          <Download className="w-4 h-4" />
          <span>Download Tax Packet (PDF)</span>
        </button>
      </div>

      {/* P&L Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">Total Sales Revenue</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatAmount(12450)}</span>
          <span className="text-[11px] text-emerald-600 font-bold block mt-2">100% of Gross Inflow</span>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">Operating Deductibles</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatAmount(7820)}</span>
          <span className="text-[11px] text-slate-400 font-medium block mt-2">62.8% of Total Inflow</span>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mb-1">Net Taxable Income</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatAmount(4630)}</span>
          <span className="text-[11px] text-slate-400 font-medium block mt-2">Est. Tax (15%): {formatAmount(694.5)}</span>
        </div>
      </div>

      {/* Detailed P&L Breakdown Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200/90 dark:border-dark-border shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-dark-border">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Profit & Loss Detailed Breakdown</h3>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
            <tr className="bg-slate-50/50 dark:bg-dark-surface/50 font-bold text-slate-900 dark:text-white">
              <td className="py-3 px-5">1. Operating Inflow (Sales & Services)</td>
              <td className="py-3 px-5 text-right">{formatAmount(12450)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Design & Branding Services</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(5450)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Product Retainers</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(4000)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Web Redesign Handover</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(3000)}</td>
            </tr>

            <tr className="bg-slate-50/50 dark:bg-dark-surface/50 font-bold text-slate-900 dark:text-white">
              <td className="py-3 px-5">2. Operating Expenses</td>
              <td className="py-3 px-5 text-right text-rose-500">({formatAmount(7820)})</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Contractors & Developers</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(3200)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Software & Cloud Hosting</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(2100)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Marketing & Google Ads</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(1500)}</td>
            </tr>
            <tr>
              <td className="py-2.5 px-5 pl-9 text-slate-600 dark:text-slate-300">Office & Miscellaneous Supplies</td>
              <td className="py-2.5 px-5 text-right font-medium text-slate-800 dark:text-slate-200">{formatAmount(1020)}</td>
            </tr>

            <tr className="bg-emerald-50/60 dark:bg-emerald-950/30 font-extrabold text-sm text-emerald-900 dark:text-emerald-300">
              <td className="py-4 px-5">Net Operating Profit</td>
              <td className="py-4 px-5 text-right">{formatAmount(4630)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
