import React from 'react';
import { Search, Bell, Sparkles, Plus, ChevronDown } from 'lucide-react';

interface HeaderProps {
  onOpenAgentModal: () => void;
  onOpenNewPaymentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAgentModal, onOpenNewPaymentModal }) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4">
      {/* Top Search & Profile Row */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything"
            className="w-full bg-[#F8F9FA] border border-slate-200/80 rounded-xl pl-10 pr-12 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs">
            <span>⌘</span>
            <span>F</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Assistant Button */}
          <button
            onClick={onOpenAgentModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 text-xs font-semibold transition-all shadow-xs"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assistant</span>
          </button>

          {/* Notifications */}
          <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
            <Bell className="w-4 h-4" />
          </button>

          {/* Profile User */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
              alt="Esther Howard"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block leading-tight">Esther Howard</span>
              <span className="text-[10px] text-slate-400 font-medium block">Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </div>
        </div>
      </div>

      {/* Bottom Page Title & Action Row */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Business Finance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your invoices, expenses, and taxes</p>
        </div>

        <button
          onClick={onOpenNewPaymentModal}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-sm shadow-emerald-500/25 transition-all transform active:scale-98"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Payment</span>
        </button>
      </div>
    </header>
  );
};
