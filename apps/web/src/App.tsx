import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { RevenueChart } from './components/RevenueChart';
import { ExpenseBreakdown } from './components/ExpenseBreakdown';
import { InvoicesTable } from './components/InvoicesTable';
import { RecentExpenses } from './components/RecentExpenses';
import { WhatsAppAgentModal } from './components/WhatsAppAgentModal';
import { NewPaymentModal } from './components/NewPaymentModal';
import type { DashboardKpis } from '@w2l/shared';

// Initial state strictly matching the user's reference image
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

const initialCategories = [
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
  const [subTab, setSubTab] = useState<'Overview' | 'Invoices' | 'Expenses' | 'Tax'>('Overview');
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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
      // Keeps initial high-fidelity mock data if offline
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar activeTab={activeNav} setActiveTab={setActiveNav} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenAgentModal={() => setIsAgentModalOpen(true)}
          onOpenNewPaymentModal={() => setIsPaymentModalOpen(true)}
        />

        {/* Dashboard Body Container */}
        <main className="flex-1 px-8 py-6 space-y-6 overflow-y-auto">
          {/* Top 4 KPI Metric Cards */}
          <KpiCards kpis={kpis} />

          {/* Sub Navigation Tabs (Overview, Invoices, Expenses, Tax) */}
          <div className="flex items-center gap-2 pt-1 pb-2">
            {(['Overview', 'Invoices', 'Expenses', 'Tax'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  subTab === tab
                    ? 'bg-emerald-400 text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Two-Column Layout matching reference image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Main Column (7 cols on lg screens) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Monthly Revenue vs Expenses Bar Chart */}
              <RevenueChart data={chartData} />

              {/* Invoices Table */}
              <InvoicesTable invoices={invoices} />
            </div>

            {/* Right Column (5 cols on lg screens) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Expense Breakdown Categories */}
              <ExpenseBreakdown categories={categories} />

              {/* Recent Expenses Feed */}
              <RecentExpenses />
            </div>
          </div>
        </main>
      </div>

      {/* WhatsApp Agent Interactive Modal */}
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
