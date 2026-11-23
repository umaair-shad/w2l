import React from 'react';
import { User, Megaphone, BookOpen, Laptop } from 'lucide-react';

interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  iconType: 'user' | 'ad' | 'office' | 'dev';
}

export const RecentExpenses: React.FC = () => {
  const items: ExpenseItem[] = [
    {
      id: '1',
      title: 'Backend Developer',
      category: 'Contractors',
      date: 'Aug 07',
      amount: 1400,
      iconType: 'dev',
    },
    {
      id: '2',
      title: 'Google Ads',
      category: 'Marketing',
      date: 'Aug 06',
      amount: 800,
      iconType: 'ad',
    },
    {
      id: '3',
      title: 'Notebooks, Pens',
      category: 'Office',
      date: 'Aug 05',
      amount: 80,
      iconType: 'office',
    },
    {
      id: '4',
      title: 'UI Freelancer Payment',
      category: 'Contractors',
      date: 'Aug 01',
      amount: 1800,
      iconType: 'user',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Expenses</h2>
        </div>
        <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                  {item.iconType === 'dev' && <Laptop className="w-4 h-4 text-emerald-600" />}
                  {item.iconType === 'ad' && <Megaphone className="w-4 h-4 text-sky-600" />}
                  {item.iconType === 'office' && <BookOpen className="w-4 h-4 text-indigo-600" />}
                  {item.iconType === 'user' && <User className="w-4 h-4 text-slate-600" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">{item.title}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                  </div>
                </div>
              </div>

              <span className="text-sm font-bold text-slate-900">${item.amount.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
