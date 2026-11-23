import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  FileText,
  DollarSign,
  Receipt,
  Briefcase,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'money', label: 'Money Management', icon: DollarSign },
    { id: 'tax', label: 'Tax & Finances', icon: Receipt },
    { id: 'business', label: 'Business Finance', icon: Briefcase, active: true },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const prefMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">Lukana</span>
            <span className="text-[10px] font-semibold text-emerald-600 block leading-none">W2L Edition</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2 block">
            Menu
          </span>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id || item.active;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-slate-100/90 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2 block">
            Preference
          </span>
          <nav className="space-y-1">
            {prefMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* WhatsApp Agent Quick Status Banner */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div className="flex-1">
            <span className="text-xs font-bold text-emerald-900 block">WhatsApp Agent</span>
            <span className="text-[11px] text-emerald-700">Native Bridge Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
