import React, { useState } from 'react';
import { Key, Sparkles, Moon, Sun, Shield, CheckCircle2, Globe, Database } from 'lucide-react';

interface SettingsViewProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ darkMode, setDarkMode }) => {
  const [waApiKey, setWaApiKey] = useState('wa_demo_live_key_98214');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          System Settings & Integrations
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure WhatsApp Native Agent API key, Gemini AI, and appearance
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration saved successfully!</span>
        </div>
      )}

      {/* 1. Theme & Appearance */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Appearance & Theme</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Switch between crisp clean Light mode and high-contrast Dark mode
        </p>

        <div className="flex items-center gap-3 pt-2">
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

      {/* 2. WhatsApp Third-Party Agent API Configuration */}
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

      {/* 3. Google Gemini 2.0 Flash AI Key */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200/90 dark:border-dark-border shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Google Gemini 2.0 Flash (Free Tier)</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Get your free API key in 30 seconds at aistudio.google.com for multilingual voice notes and receipt OCR
        </p>

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

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm shadow-emerald-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
