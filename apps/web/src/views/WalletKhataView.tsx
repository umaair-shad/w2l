import React, { useState, useEffect } from 'react';
import { Search, Phone, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export const WalletKhataView: React.FC = () => {
  const [parties, setParties] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const { formatAmount } = useCurrency();

  useEffect(() => {
    fetch('/api/dashboard/parties')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setParties(data);
      })
      .catch(() => {});
  }, []);

  const filtered = parties.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.tag && p.tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Wallet & Khata Ledger
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accounts receivable (Udhar lena hai) and accounts payable (Dena hai)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multi-Party Disambiguation Protected</span>
          </div>
        </div>
      </div>

      {/* Disambiguation Highlight Notice */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <b>Notice the two Bilals below:</b> When a voice note or message on WhatsApp says <i>"Paid 5000 to Bilal"</i>, the W2L agent automatically asks whether you mean <b>Bilal Electrician</b> or <b>Bilal Cloth Merchant</b>. No mix-ups ever happen!
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200/90 dark:border-dark-border flex items-center justify-between shadow-2xs">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search party by name or business tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Parties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((party) => {
          const isReceivable = party.current_balance >= 0;

          return (
            <div
              key={party.id}
              className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-slate-200/90 dark:border-dark-border shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-dark-surface flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-sm">
                      {party.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {party.name}
                      </h3>
                      {party.tag && (
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          {party.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      isReceivable
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                    }`}
                  >
                    {isReceivable ? 'Receivable' : 'Payable'}
                  </span>
                </div>

                {party.phone && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-4">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{party.phone}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-dark-border flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-medium">Net Balance:</span>
                <span
                  className={`text-base font-extrabold ${
                    isReceivable ? 'text-slate-900 dark:text-white' : 'text-rose-500'
                  }`}
                >
                  {formatAmount(Math.abs(party.current_balance))}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
