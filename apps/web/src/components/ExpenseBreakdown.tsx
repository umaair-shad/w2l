import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { ExpenseCategoryBreakdown } from '@w2l/shared';
import { useCurrency } from '../context/CurrencyContext';

interface ExpenseBreakdownProps {
  categories: ExpenseCategoryBreakdown[];
}

export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({ categories }) => {
  const { formatAmount } = useCurrency();

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Expense Breakdown</h2>
          <p className="text-xs text-slate-400">By category this month</p>
        </div>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Pattern Progress Bar matching reference image */}
      <div className="h-10 w-full rounded-xl overflow-hidden flex gap-1 p-1 bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border mb-6">
        <div style={{ width: '27%' }} className="h-full rounded-lg bg-emerald-400 shadow-2xs"></div>
        <div style={{ width: '19%' }} className="h-full rounded-lg bg-sky-500 shadow-2xs"></div>
        <div style={{ width: '35%' }} className="h-full rounded-lg bg-indigo-600 shadow-2xs"></div>
        <div style={{ width: '10%' }} className="h-full rounded-lg bg-slate-800 dark:bg-slate-700 shadow-2xs"></div>
        <div style={{ width: '9%' }} className="h-full rounded-lg bg-orange-400 shadow-2xs"></div>
      </div>

      {/* Categories Grid (2 columns matching reference image) */}
      <div className="grid grid-cols-3 gap-y-4 gap-x-2">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">{cat.category}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {formatAmount(cat.amount)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">{cat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
