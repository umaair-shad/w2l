import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentCreated: () => void;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentCreated,
}) => {
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Software');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BANK'>('BANK');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      await fetch('/api/dashboard/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          payment_method: paymentMethod,
          description: description || `${type} payment of $${amount}`,
        }),
      });

      onPaymentCreated();
      onClose();
    } catch (err) {
      alert('Failed to log payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">New Payment Entry</h3>
              <p className="text-xs text-slate-400">Manual double-entry ledger record</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                type === 'EXPENSE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                type === 'INCOME' ? 'bg-white text-emerald-600 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Income / Sale
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Amount ($)</label>
            <input
              type="number"
              required
              step="any"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="Software">Software & Cloud</option>
                <option value="Marketing">Marketing & Ads</option>
                <option value="Contractors">Contractors</option>
                <option value="Utilities">Utilities & Rent</option>
                <option value="Office">Office Supplies</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Sales">Sales & Services</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="BANK">Bank Account</option>
                <option value="CASH">Cash on Hand</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Description / Memo</label>
            <input
              type="text"
              placeholder="e.g. Adobe suite renewal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
            >
              {loading ? 'Logging...' : 'Confirm Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
