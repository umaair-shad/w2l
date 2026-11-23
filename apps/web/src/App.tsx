import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BusinessFinanceView } from './views/BusinessFinanceView';
import { DashboardOverviewView } from './views/DashboardOverviewView';
import { TransactionsView } from './views/TransactionsView';
import { InvoicesView } from './views/InvoicesView';
import { WalletKhataView } from './views/WalletKhataView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { WhatsAppAgentModal } from './components/WhatsAppAgentModal';
import { NewPaymentModal } from './components/NewPaymentModal';
import type { DashboardKpis, ExpenseCategoryBreakdown } from '@w2l/shared';

const initialKpis: DashboardKpis = {
  total_revenue: { value: 12450, currency: 'USD', change_percentage: 8, trend: 'up' },
  total_expenses: { value: 7820, currency: 'USD', change_percentage: -3, trend: 'down' },
  net_profit: { value: 4630, currency: 'USD', change_percentage: 15, trend: 'up' },
  pending_invoices: { count: 3, total_value: 6900, currency: 'USD' },
};

const initialMonths = [
  { month: 'Jan', revenue: 7000, expenses: 4500 },
  { month: 'Feb', revenue: 8500, expenses: 5200 },
  { month: 'Mar', revenue: 10500, expenses: 6200 },
  { month: 'Apr', revenue: 12450, expenses: 7820 },
  { month: 'May', revenue: 9800, expenses: 6100 },
  { month: 'Jun', revenue: 11200, expenses: 7300 },
  { month: 'Jul', revenue: 9400, expenses: 5800 },
  { month: 'Aug', revenue: 10800, expenses: 6900 },
  { month: 'Sep', revenue: 8900, expenses: 5400 },
  { month: 'Oct', revenue: 9500, expenses: 6000 },
  { month: 'Nov', revenue: 11500, expenses: 7100 },
];

const initialCategories: ExpenseCategoryBreakdown[] = [
  { category: 'Software', amount: 2100, percentage: 27, color: '#10B981' },
  { category: 'Marketing', amount: 1500, percentage: 19, color: '#38BDF8' },
  { category: 'Contractors', amount: 3200, percentage: 41, color: '#3B82F6' },
  { category: 'Misc', amount: 1020, percentage: 13, color: '#1E293B' },
  { category: 'Entertainment', amount: 2100, percentage: 5, color: '#F97316' },
  { category: 'Extra', amount: 2366, percentage: 18, color: '#34D399' },
];

const initialInvoices = [
  {
    id: '1',
    invoice_id: 'INV-10021',
    client: 'Pixel Studio',
    service: 'Branding Design',
    status: 'PAID' as const,
    amount: 2300,
    due_date: 'Aug 05',
  },
  {
    id: '2',
    invoice_id: 'INV-10022',
    client: 'NovaTech ILC',
    service: 'Mobile App UI',
    status: 'PENDING' as const,
    amount: 4500,
    due_date: 'Aug 12',
  },
  {
    id: '3',
    invoice_id: 'INV-10023',
    client: 'BlueOcean Ltd',
    service: 'Web Redesign',
    status: 'OVERDUE' as const,
    amount: 3200,
    due_date: 'Aug 01',
  },
];

export const App: React.FC = () => {
  const [activeNav, setActiveNav] = useState('business');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('w2l_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('w2l_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('w2l_theme', 'light');
    }
  }, [darkMode]);

  const [kpis, setKpis] = useState<DashboardKpis>(initialKpis);
  const [chartData, setChartData] = useState(initialMonths);
  const [categories, setCategories] = useState(initialCategories);
  const [invoices, setInvoices] = useState(initialInvoices);

  const fetchDashboardData = async () => {
    try {
      const [kpisRes, chartRes, catRes, invRes] = await Promise.all([
        fetch('/api/dashboard/kpis').then((r) => r.json()),
        fetch('/api/dashboard/revenue-overview').then((r) => r.json()),
        fetch('/api/dashboard/expense-breakdown').then((r) => r.json()),
        fetch('/api/dashboard/invoices').then((r) => r.json()),
      ]);

      if (kpisRes && kpisRes.total_revenue) setKpis(kpisRes);
      if (chartRes && chartRes.months) setChartData(chartRes.months);
      if (Array.isArray(catRes) && catRes.length > 0) setCategories(catRes);
      if (Array.isArray(invRes) && invRes.length > 0) setInvoices(invRes);
    } catch (e) {
      // Fallback
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-dark-bg text-slate-800 dark:text-slate-100 flex transition-colors">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeNav}
        setActiveTab={setActiveNav}
        onOpenAgentModal={() => setIsAgentModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeNav}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenAgentModal={() => setIsAgentModalOpen(true)}
          onOpenNewPaymentModal={() => setIsPaymentModalOpen(true)}
        />

        <main className="flex-1 px-8 py-6 overflow-y-auto">
          {activeNav === 'business' && (
            <BusinessFinanceView
              kpis={kpis}
              chartData={chartData}
              categories={categories}
              invoices={invoices}
            />
          )}

          {activeNav === 'dashboard' && <DashboardOverviewView />}

          {activeNav === 'transactions' && <TransactionsView />}

          {activeNav === 'invoices' && <InvoicesView invoices={invoices} />}

          {activeNav === 'wallet' && <WalletKhataView />}

          {activeNav === 'reports' && <ReportsView />}

          {(activeNav === 'settings' || activeNav === 'help') && (
            <SettingsView darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </main>
      </div>

      {/* WhatsApp Agent Interactive Live Modal */}
      <WhatsAppAgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        onTransactionLogged={fetchDashboardData}
      />

      {/* New Payment Modal */}
      <NewPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentCreated={fetchDashboardData}
      />
    </div>
  );
};

export default App;
