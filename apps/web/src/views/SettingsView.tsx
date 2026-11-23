import React, { useState } from 'react';
import { Key, Sparkles, Moon, Sun, Shield, CheckCircle2, User, Coins } from 'lucide-react';
import { useCurrency, SYMBOL_MAP } from '../context/CurrencyContext';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ darkMode, setDarkMode }) => {
  const { currency, setCurrency, profile, updateProfile } = useCurrency();

  const [waApiKey, setWaApiKey] = useState('wa_demo_live_key_98214');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  
  // Profile Form State
  const [name, setName] = useState(profile.name || 'Esther Howard');
  const [businessName, setBusinessName] = useState(profile.business_name || 'W2L Business Commerce');
  const [phone, setPhone] = useState(profile.phone || '+92 300 1234567');
  const [email, setEmail] = useState(profile.email || 'esther@w2l.internal');

  const [saved, setSaved] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      business_name: businessName,
      phone,
      email,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCurrencySelect = async (curr: string) => {
    await setCurrency(curr);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currenciesList = [
    { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', isDefault: true },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Profile & System Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage currency units, merchant profile, WhatsApp Native Agent API, and theme
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings & Currency updated successfully in database!</span>
        </div>
      )}

      {/* 1. Currency Unit Selection (Default: PKR) */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Base Currency & Accounting Unit</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select the default currency applied across all reports, charts, invoices, and WhatsApp entries.
            </p>
          </div>
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Active: {currency} ({SYMBOL_MAP[currency] || 'Rs'})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {currenciesList.map((item) => {
            const isSelected = currency === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleCurrencySelect(item.code)}
                className={`p-3.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{item.code}</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.symbol}</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{item.name}</span>
                {item.isDefault && (
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                    (Default)
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. User Merchant Profile */}
      <form onSubmit={handleProfileSave} className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          <span>User & Business Profile</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personal details attached to receipts, invoices, and accounting exports
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">WhatsApp / Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-500/20 transition-all"
          >
            Update Profile
          </button>
        </div>
      </form>

      {/* 3. Theme & Appearance */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Appearance & Theme</span>
        </h2>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              !darkMode
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Light Mode</span>
          </button>

          <button
            onClick={() => setDarkMode(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              darkMode
                ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Mode</span>
          </button>
        </div>
      </div>

      {/* 4. WhatsApp Third-Party Agent API Configuration */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp Native Agent Integration</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Link the API key generated inside your WhatsApp App (Settings &gt; Agents &gt; Add an agent)
        </p>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Agent API Key</label>
          <input
            type="text"
            value={waApiKey}
            onChange={(e) => setWaApiKey(e.target.value)}
            className="w-full font-mono bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* 5. Google Gemini 2.0 Flash AI Key */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Google Gemini 2.0 Flash (Free Tier)</span>
        </h2>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Gemini API Key</label>
          <input
            type="password"
            placeholder="AIzaSy..."
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full font-mono bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </div>
  );
};
