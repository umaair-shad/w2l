export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'CREDIT_SALE' | 'CREDIT_PURCHASE';

export type PaymentMethod = 'CASH' | 'BANK' | 'CREDIT_UDHAR';

export type SourceChannel = 'WHATSAPP_VOICE' | 'WHATSAPP_IMAGE' | 'WHATSAPP_TEXT' | 'WEB_MANUAL';

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface Party {
  id: string;
  name: string;
  phone?: string;
  tag?: string;
  current_balance: number;
  notes?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  source_channel: SourceChannel;
  raw_input?: string;
  status: 'POSTED' | 'VOID' | 'DRAFT';
  amount?: number;
  type?: TransactionType;
  party_name?: string;
  party_id?: string;
  category?: string;
  payment_method?: PaymentMethod;
  created_at: string;
}

export interface LedgerEntry {
  id: string;
  transaction_id: string;
  account_id: string;
  party_id?: string;
  debit: number;
  credit: number;
  memo?: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  party_id: string;
  party_name?: string;
  service_description: string;
  amount: number;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  created_at: string;
}

export interface DashboardKpis {
  total_revenue: {
    value: number;
    currency: string;
    change_percentage: number;
    trend: 'up' | 'down';
  };
  total_expenses: {
    value: number;
    currency: string;
    change_percentage: number;
    trend: 'up' | 'down';
  };
  net_profit: {
    value: number;
    currency: string;
    change_percentage: number;
    trend: 'up' | 'down';
  };
  pending_invoices: {
    count: number;
    total_value: number;
    currency: string;
  };
}

export interface RevenueChartPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseCategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface WhatsAppAgentInbound {
  agent_id?: string;
  message_id: string;
  timestamp: number;
  sender: {
    user_id: string;
    display_name?: string;
  };
  type: 'text' | 'audio' | 'image';
  content: {
    text?: string;
    media_url?: string;
    mime_type?: string;
    media_base64?: string;
  };
}

export interface WhatsAppAgentOutbound {
  status: 'success' | 'clarification_needed' | 'error';
  reply: {
    text: string;
    requires_action: boolean;
    suggested_actions?: string[];
  };
  recorded_transaction?: Partial<Transaction>;
}
