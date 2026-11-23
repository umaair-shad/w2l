import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  currency: string;
  currency_symbol: string;
  theme: string;
}

export const SYMBOL_MAP: Record<string, string> = {
  PKR: 'Rs',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  SAR: 'SAR',
  INR: '₹',
};

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  profile: UserProfile;
  formatAmount: (amount: number | undefined | null) => string;
  setCurrency: (curr: string) => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: 'Esther Howard',
  business_name: 'W2L Business Commerce',
  email: 'esther@w2l.internal',
  phone: '+92 300 1234567',
  currency: 'PKR',
  currency_symbol: 'Rs',
  theme: 'light',
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'PKR',
  currencySymbol: 'Rs',
  profile: defaultProfile,
  formatAmount: (amount) => `Rs ${(amount || 0).toLocaleString()}`,
  setCurrency: async () => {},
  updateProfile: async () => {},
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('w2l_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultProfile;
  });

  // Fetch latest profile from DB
  useEffect(() => {
    fetch('/api/dashboard/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.currency) {
          setProfileState(data);
          localStorage.setItem('w2l_profile', JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = async (newCurr: string) => {
    const symbol = SYMBOL_MAP[newCurr] || newCurr;
    const updated = { ...profile, currency: newCurr, currency_symbol: symbol };
    setProfileState(updated);
    localStorage.setItem('w2l_profile', JSON.stringify(updated));

    try {
      await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: newCurr, currency_symbol: symbol }),
      });
    } catch (e) {
      console.warn('Failed to sync currency to backend DB', e);
    }
  };

  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    const merged = { ...profile, ...updatedData };
    setProfileState(merged);
    localStorage.setItem('w2l_profile', JSON.stringify(merged));

    try {
      await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
    } catch (e) {
      console.warn('Failed to sync profile to backend DB', e);
    }
  };

  const formatAmount = (amount: number | undefined | null) => {
    const val = amount || 0;
    const symbol = profile.currency_symbol || 'Rs';
    if (symbol === '$' || symbol === '€' || symbol === '£' || symbol === '₹') {
      return `${symbol}${val.toLocaleString()}`;
    }
    return `${symbol} ${val.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: profile.currency || 'PKR',
        currencySymbol: profile.currency_symbol || 'Rs',
        profile,
        formatAmount,
        setCurrency,
        updateProfile,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
