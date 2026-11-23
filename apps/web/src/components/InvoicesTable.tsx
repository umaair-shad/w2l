import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface InvoiceItem {
  id: string;
  invoice_id: string;
  client: string;
  client_tag?: string;
  service: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  due_date: string;
}

interface InvoicesTableProps {
  invoices: InvoiceItem[];
}

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Invoices</h2>
          <p className="text-xs text-slate-400">Manage your client invoices</p>
        </div>
        <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">
              <th className="pb-3 font-semibold">Invoice ID</th>
              <th className="pb-3 font-semibold">Client</th>
              <th className="pb-3 font-semibold">Service</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Due Date</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs">
            {invoices.map((inv) => {
              const statusStyles = {
                PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
                PENDING: 'bg-amber-50 text-amber-700 border-amber-200/60',
                OVERDUE: 'bg-rose-50 text-rose-700 border-rose-200/60',
              }[inv.status] || 'bg-slate-50 text-slate-700 border-slate-200';

              return (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 font-bold text-slate-800">{inv.invoice_id}</td>
                  <td className="py-3.5 font-semibold text-slate-900">
                    {inv.client}
                    {inv.client_tag && (
                      <span className="text-[10px] text-slate-400 block font-normal">{inv.client_tag}</span>
                    )}
                  </td>
                  <td className="py-3.5 text-slate-500 font-medium">{inv.service}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${statusStyles}`}>
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-slate-900">${inv.amount.toLocaleString()}</td>
                  <td className="py-3.5 text-slate-500 font-medium">{inv.due_date}</td>
                  <td className="py-3.5 text-right">
                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors">
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
