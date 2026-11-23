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
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAgentModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenAgentModal }) => {
  const mainMenuItems = [
    { id: 'business', label: 'Business Finance', icon: Briefcase },
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const prefMenuItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-surface border-r border-slate-200 dark:border-dark-border flex flex-col h-screen sticky top-0 shrink-0 select-none transition-colors">
      {/* Brand Logo Header matching Image 0, 1 & 2 */}
      <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          {/* Custom Dual Chevron Geometric Logo */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white leading-none block">
              Finlytics
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-1 tracking-wider uppercase">
              W2L Edition
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-3 mb-2 block">
            Menu
          </span>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-dark-card text-slate-900 dark:text-white font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-card/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase px-3 mb-2 block">
            Preference
          </span>
          <nav className="space-y-1">
            {prefMenuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-dark-card text-slate-900 dark:text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-dark-card/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* WhatsApp Agent Quick Launch Card */}
      <div className="p-4 border-t border-slate-100 dark:border-dark-border">
        <button
          onClick={onOpenAgentModal}
          className="w-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-3 text-left transition-all group"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">WhatsApp Agent</span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block">
            Open Chat & Voice Simulator →
          </span>
        </button>
      </div>
    </aside>
  );
};
