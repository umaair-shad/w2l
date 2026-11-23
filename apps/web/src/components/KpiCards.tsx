import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Activity, Clock } from 'lucide-react';
import type { DashboardKpis } from '@w2l/shared';
import { useCurrency } from '../context/CurrencyContext';

interface KpiCardsProps {
  kpis: DashboardKpis;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis }) => {
  const { formatAmount } = useCurrency();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Revenue Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatAmount(kpis.total_revenue.value)}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs text-slate-400">last month</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <TrendingUp className="w-3 h-3" />
            +{kpis.total_revenue.change_percentage}%
          </span>
        </div>
      </div>

      {/* 2. Total Expenses Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Expenses</span>
          <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatAmount(kpis.total_expenses.value)}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs text-slate-400">vs last month</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <TrendingDown className="w-3 h-3" />
            {kpis.total_expenses.change_percentage}%
          </span>
        </div>
      </div>

      {/* 3. Net Profit Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Profit</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {formatAmount(kpis.net_profit.value)}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs text-slate-400">last month</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            <TrendingUp className="w-3 h-3" />
            +{kpis.net_profit.change_percentage}%
          </span>
        </div>
      </div>

      {/* 4. Pending Invoices Card */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Invoices</span>
          <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {kpis.pending_invoices.count}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs text-slate-400">total vs last month</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
            {formatAmount(kpis.pending_invoices.total_value)}
          </span>
        </div>
      </div>
    </div>
  );
};
