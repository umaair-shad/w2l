import React, { useState } from 'react';
import { X, Key, Send, Mic, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WhatsAppAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionLogged: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  type?: 'text' | 'voice' | 'image';
  timestamp: string;
}

export const WhatsAppAgentModal: React.FC<WhatsAppAgentModalProps> = ({
  isOpen,
  onClose,
  onTransactionLogged,
}) => {
  const [apiKey, setApiKey] = useState('wa_demo_live_key_98214');
  const [activeTab, setActiveTab] = useState<'simulator' | 'connect'>('simulator');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: `Assalam-o-Alaikum! 👋 I am your W2L Smart Munshi (AI Ledger Assistant).\n\nTry sending a message or click one of the quick test chips below!`,
      timestamp: 'Just now',
    },
  ]);

  if (!isOpen) return null;

  const sendMessage = async (customText?: string, type: 'text' | 'voice' | 'image' = 'text') => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() && type === 'text') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      type,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/whatsapp/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'merchant_demo',
          type,
          text: textToSend,
        }),
      });

      const data = await res.json();
      const replyText = data.reply?.text || 'Message processed.';

      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, agentMsg]);
      onTransactionLogged();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: '⚠️ Network error communicating with W2L engine.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="bg-[#128C7E] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">W2L WhatsApp Native Agent</h3>
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">
                  Connected
                </span>
              </div>
              <p className="text-xs text-white/80">Google Gemini 2.0 Flash Multimodal Brain</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-6">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'simulator'
                ? 'border-[#128C7E] text-[#128C7E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            💬 Interactive Live Chat Simulator
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'connect'
                ? 'border-[#128C7E] text-[#128C7E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 WhatsApp API Key Bridge
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'simulator' ? (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#ECE5DD]/40">
            {/* Quick Demo Action Chips */}
            <div className="p-3 bg-white border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
              <span className="font-semibold text-slate-400 text-[11px] shrink-0">Quick Tests:</span>
              <button
                onClick={() => sendMessage('Give 5000 to Bilal', 'text')}
                className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-amber-100 shrink-0"
              >
                👥 Test 2 Bilals Disambiguation
              </button>
              <button
                onClick={() => sendMessage('Paid 1200 cash for petrol', 'voice')}
                className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-emerald-100 shrink-0"
              >
                🎙️ Voice: Fuel Rs 1,200
              </button>
              <button
                onClick={() => sendMessage('Received 6000 from client for branding design', 'text')}
                className="bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-sky-100 shrink-0"
              >
                💰 Sale: Design Rs 6,000
              </button>
              <button
                onClick={() => sendMessage('What is my total profit?', 'text')}
                className="bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-purple-100 shrink-0"
              >
                📊 Q&A: Profit inquiry
              </button>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs whitespace-pre-wrap leading-relaxed ${
                        isUser
                          ? 'bg-[#E7FFDB] text-slate-900 rounded-tr-xs'
                          : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/60'
                      }`}
                    >
                      {m.type === 'voice' && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1 text-[11px]">
                          <Mic className="w-3.5 h-3.5" />
                          <span>Voice Note Simulation</span>
                        </div>
                      )}
                      <div>{m.text}</div>
                      <div className="text-[10px] text-slate-400 text-right mt-1 font-medium">{m.timestamp}</div>
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-2 text-xs text-slate-500 border border-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span>W2L Agent is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type or reply '1' to choose Bilal..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="w-9 h-9 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Key className="w-4 h-4 text-emerald-600" />
                <span>Your WhatsApp Agent API Key</span>
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Generated from WhatsApp Settings ➔ Agents ➔ Add an agent.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 font-mono text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
                <button
                  onClick={() => alert('API Key saved successfully!')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Save Key
                </button>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
              <h5 className="text-xs font-bold text-slate-900">How WhatsApp Third-Party Agent Works:</h5>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
                <li>Open WhatsApp on your phone ➔ <b>Settings</b> ➔ <b>Agents</b>.</li>
                <li>Tap <b>Add an agent</b>, enter a name (e.g. <i>Mera Munshi</i>) and save.</li>
                <li>Copy the generated <b>API Key</b> and paste it into the field above.</li>
                <li>
                  Done! Your dedicated agent chat will be ready inside WhatsApp. Any voice note, receipt photo, or text
                  message will be processed by W2L instantly.
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
