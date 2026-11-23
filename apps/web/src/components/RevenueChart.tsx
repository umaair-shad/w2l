import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number; expenses: number }>;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Revenue Overview</h2>
          <p className="text-xs text-slate-400">Monthly revenue vs expenses</p>
        </div>

        {/* Legend matching reference image */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              tickFormatter={(val) => `$${val / 1000}k`}
              domain={[0, 14000]}
              ticks={[0, 3500, 7000, 10500, 14000]}
            />
            <Tooltip
              formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
              contentStyle={{
                backgroundColor: '#1E293B',
                borderRadius: '8px',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="revenue" fill="#A7F3D0" radius={[4, 4, 0, 0]} maxBarSize={18} />
            <Bar dataKey="expenses" fill="#E2E8F0" radius={[4, 4, 0, 0]} maxBarSize={18} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
