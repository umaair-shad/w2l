import React, { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';

export const DashboardOverviewView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly');

  // Cash Flow Insights dual-direction dataset matching Image 1
  const cashFlowData = [
    { period: '1', positive: 4800, negative: -2200 },
    { period: '2', positive: 5800, negative: -2600 },
    { period: '3', positive: 3900, negative: -1900 },
    { period: '4', positive: 2800, negative: -2400 },
    { period: '5', positive: 5600, negative: -3200 },
    { period: '6', positive: 4200, negative: -2100 },
    { period: '7', positive: 5900, negative: -3800 },
    { period: '8', positive: 4900, negative: -1800 },
    { period: '9', positive: 3800, negative: -2300 },
    { period: '10', positive: 4100, negative: -2000 },
  ];

  // Profit & Loss Monitoring multi-line dataset matching Image 1
  const plData = [
    { name: 'Jan', yellow: 0.7, blue: 0.5, green: 0.3 },
    { name: 'Feb', yellow: 0.72, blue: 0.52, green: 0.32 },
    { name: 'Mar', yellow: 0.85, blue: 0.65, green: 0.45 },
    { name: 'Apr', yellow: 0.98, blue: 0.78, green: 0.68 },
    { name: 'May', yellow: 1.05, blue: 0.82, green: 0.75 },
    { name: 'Jun', yellow: 1.15, blue: 0.9, green: 0.85 },
    { name: 'Jul', yellow: 1.25, blue: 0.95, green: 0.9 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner matching Image 1 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Good Morning, Alex!
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Take a look at a glance of all your business how going
        </p>
      </div>

      {/* Top 3 Metric Cards + Cash Flow Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 3 Stat Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Total Revenue Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Revenue</span>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-dark-border px-2.5 py-1 rounded-lg">
                <span>Analytics</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                $45,672K
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                56%
              </span>
            </div>
          </div>

          {/* 2. Expenses Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Expenses</span>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-dark-border px-2.5 py-1 rounded-lg">
                <span>Report Manager</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                $28,903K
              </span>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                -0.2%
              </span>
            </div>
          </div>

          {/* 3. Net Profit Card */}
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Net Profit</span>
              <button className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-dark-border px-2.5 py-1 rounded-lg">
                <span>P & L</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                $34,215K
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                56%
              </span>
            </div>
          </div>
        </div>

        {/* Right Cash Flow Insights Chart (7 cols) matching Image 1 */}
        <div className="lg:col-span-7 bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Cash Flow Insights</h2>
              <p className="text-xs text-slate-400">Bi-directional liquidity flow</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inflow</span>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 ml-2"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Outflow</span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} stackOffset="sign" barGap={0} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.4} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  formatter={(val: number) => [`$${Math.abs(val)}`, val > 0 ? 'Inflow' : 'Outflow']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="positive" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="negative" fill="#F59E0B" radius={[0, 0, 4, 4]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Profit & Loss Monitoring Curve Chart matching Image 1 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Profit & Loss Monitoring</h2>
            <p className="text-xs text-slate-400">Comparative multi-period margin ratios</p>
          </div>

          {/* Timeframe switchers */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-dark-surface p-1 rounded-xl">
            {(['Monthly', 'Weekly', 'Daily'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeframe === t
                    ? 'bg-white dark:bg-dark-card text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={plData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="yellow" stroke="#EAB308" strokeWidth={2.5} fillOpacity={0} />
              <Area type="monotone" dataKey="blue" stroke="#3B82F6" strokeWidth={2.5} fillOpacity={0} />
              <Area type="monotone" dataKey="green" stroke="#10B981" strokeWidth={2.5} fill="url(#colorGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
