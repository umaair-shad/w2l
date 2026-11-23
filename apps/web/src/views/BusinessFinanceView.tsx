import React, { useState } from 'react';
import { KpiCards } from '../components/KpiCards';
import { RevenueChart } from '../components/RevenueChart';
import { ExpenseBreakdown } from '../components/ExpenseBreakdown';
import { InvoicesTable } from '../components/InvoicesTable';
import { RecentExpenses } from '../components/RecentExpenses';
import type { DashboardKpis, ExpenseCategoryBreakdown } from '@w2l/shared';

interface BusinessFinanceViewProps {
  kpis: DashboardKpis;
  chartData: Array<{ month: string; revenue: number; expenses: number }>;
  categories: ExpenseCategoryBreakdown[];
  invoices: any[];
}

export const BusinessFinanceView: React.FC<BusinessFinanceViewProps> = ({
  kpis,
  chartData,
  categories,
  invoices,
}) => {
  const [subTab, setSubTab] = useState<'Overview' | 'Invoices' | 'Expenses' | 'Tax'>('Overview');

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <KpiCards kpis={kpis} />

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 pt-1 pb-1">
        {(['Overview', 'Invoices', 'Expenses', 'Tax'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSubTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              subTab === tab
                ? 'bg-emerald-400 text-slate-900 shadow-2xs font-extrabold'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-dark-card'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid: Left Main, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <RevenueChart data={chartData} />
          <InvoicesTable invoices={invoices} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <ExpenseBreakdown categories={categories} />
          <RecentExpenses />
        </div>
      </div>
    </div>
  );
};
