# API & Integration Specifications
## Project Name: W2L (WhatsApp to Ledger)
### Interface Types: WhatsApp Third-Party Agent API, Gemini Function Calling, Dashboard REST API

---

## 1. WhatsApp Native Agent Ingestion Protocol

### 1.1 Inbound Message Webhook / Agent Handler
* **Endpoint:** `POST /api/v1/whatsapp/agent-message`
* **Security:** `Authorization: Bearer <WHATSAPP_AGENT_API_KEY>`

#### Request Payload Structure
```json
{
  "agent_id": "wa_agt_98124a91",
  "message_id": "wamid.HBgLMTIzNDU2Nzg5MA==",
  "timestamp": 1774329600,
  "sender": {
    "user_id": "usr_wa_789123",
    "display_name": "Shop Owner"
  },
  "type": "text | audio | image",
  "content": {
    "text": "Sold 3 bags cement to Bilal for 4500 cash",
    "media_url": null,
    "mime_type": null,
    "media_base64": null
  }
}
```

#### Audio Inbound Example
```json
{
  "agent_id": "wa_agt_98124a91",
  "message_id": "wamid.HBgLMjM0NTY3ODkwMQ==",
  "timestamp": 1774329615,
  "sender": { "user_id": "usr_wa_789123", "display_name": "Shop Owner" },
  "type": "audio",
  "content": {
    "media_url": "https://api.whatsapp.internal/media/audio_xyz.opus",
    "mime_type": "audio/ogg; codecs=opus"
  }
}
```

#### Synchronous Agent Response Contract
```json
{
  "status": "success",
  "reply": {
    "text": "✅ *Entry Recorded*\n• Type: Sale (Cash)\n• Party: Bilal Electrician\n• Amount: Rs 4,500\n• Current Net Balance: Rs 16,500",
    "requires_action": false,
    "suggested_actions": []
  }
}
```

---

## 2. Google Gemini 2.0 Flash Tool Calling (Function Schemas)

The Gemini 2.0 Flash model is bound to the following tool declarations:

### 2.1 Tool: `record_transaction`
Invoked when the user expresses an income, expense, transfer, or credit transaction.

```json
{
  "name": "record_transaction",
  "description": "Records a financial transaction into the double-entry accounting ledger.",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "transaction_type": {
        "type": "STRING",
        "enum": ["INCOME", "EXPENSE", "TRANSFER", "CREDIT_SALE", "CREDIT_PURCHASE"],
        "description": "Financial category of the transaction."
      },
      "amount": {
        "type": "NUMBER",
        "description": "The exact numeric monetary value."
      },
      "currency": {
        "type": "STRING",
        "description": "Currency code (e.g. PKR, USD, INR, AED)."
      },
      "party_name": {
        "type": "STRING",
        "description": "Name of the customer, vendor, or individual involved (if applicable)."
      },
      "category": {
        "type": "STRING",
        "description": "Expense or income category (e.g. Utilities, Fuel, Rent, Inventory, Salary, Sales)."
      },
      "payment_method": {
        "type": "STRING",
        "enum": ["CASH", "BANK", "CREDIT_UDHAR"],
        "description": "How the payment was settled."
      },
      "notes": {
        "type": "STRING",
        "description": "Brief description or reference notes."
      }
    },
    "required": ["transaction_type", "amount", "category", "payment_method"]
  }
}
```

### 2.2 Tool: `query_ledger`
Invoked when the user inquires about financial balances, customer accounts, or metrics.

```json
{
  "name": "query_ledger",
  "description": "Queries the ledger for financial statements, party balances, or expense history.",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "query_type": {
        "type": "STRING",
        "enum": ["PARTY_BALANCE", "EXPENSE_SUMMARY", "CASH_FLOW", "NET_PROFIT"]
      },
      "party_name": {
        "type": "STRING",
        "description": "Specific party name to inspect (e.g. Bilal)."
      },
      "time_period": {
        "type": "STRING",
        "enum": ["TODAY", "THIS_WEEK", "THIS_MONTH", "LAST_MONTH", "ALL_TIME"]
      }
    },
    "required": ["query_type"]
  }
}
```

### 2.3 Tool: `resolve_party_disambiguation`
Invoked when ambiguous parties are returned by the internal ledger lookup.

```json
{
  "name": "resolve_party_disambiguation",
  "description": "Prompts the user to select the appropriate contact when multiple records share similar names.",
  "parameters": {
    "type": "OBJECT",
    "properties": {
      "candidates": {
        "type": "ARRAY",
        "items": {
          "type": "OBJECT",
          "properties": {
            "party_id": { "type": "STRING" },
            "name": { "type": "STRING" },
            "tag": { "type": "STRING" },
            "current_balance": { "type": "NUMBER" }
          }
        }
      },
      "pending_transaction": {
        "type": "OBJECT",
        "description": "The transaction waiting to be committed."
      }
    },
    "required": ["candidates", "pending_transaction"]
  }
}
```

---

## 3. Web Dashboard REST API (Internal)

### 3.1 `GET /api/dashboard/kpis`
Returns the 4 primary metric cards displayed at the top of the dashboard.

#### Response Example
```json
{
  "total_revenue": {
    "value": 12450.00,
    "currency": "USD",
    "change_percentage": 8.0,
    "trend": "up"
  },
  "total_expenses": {
    "value": 7820.00,
    "currency": "USD",
    "change_percentage": -3.0,
    "trend": "down"
  },
  "net_profit": {
    "value": 4630.00,
    "currency": "USD",
    "change_percentage": 15.0,
    "trend": "up"
  },
  "pending_invoices": {
    "count": 3,
    "total_value": 6900.00,
    "currency": "USD"
  }
}
```

### 3.2 `GET /api/dashboard/revenue-overview`
Supplies monthly or weekly bar chart comparative series.

#### Response Example
```json
{
  "period": "2026",
  "months": [
    { "month": "Jan", "revenue": 10500, "expenses": 6200 },
    { "month": "Feb", "revenue": 11800, "expenses": 7100 },
    { "month": "Mar", "revenue": 12450, "expenses": 7820 }
  ]
}
```

### 3.3 `GET /api/dashboard/expenses-breakdown`
Supplies segmented category percentages for the visualizer.

#### Response Example
```json
{
  "period": "this_month",
  "categories": [
    { "category": "Software", "amount": 2100.00, "percentage": 27, "color": "#10B981" },
    { "category": "Marketing", "amount": 1500.00, "percentage": 19, "color": "#3B82F6" },
    { "category": "Contractors", "amount": 3200.00, "percentage": 41, "color": "#6366F1" },
    { "category": "Misc", "amount": 1020.00, "percentage": 13, "color": "#F59E0B" }
  ]
}
```

### 3.4 `GET /api/invoices`
Returns paginated list of client/supplier invoices.

#### Response Example
```json
{
  "data": [
    {
      "invoice_id": "INV-10021",
      "client": "Pixel Studio",
      "service": "Branding Design",
      "status": "PAID",
      "amount": 2300.00,
      "due_date": "2026-08-05"
    },
    {
      "invoice_id": "INV-10022",
      "client": "NovaTech ILC",
      "service": "Mobile App UI",
      "status": "PENDING",
      "amount": 4500.00,
      "due_date": "2026-08-12"
    }
  ],
  "total": 2
}
```

### 3.5 `POST /api/agent/connect`
Receives and stores the user's WhatsApp Agent API Key.

#### Request Payload
```json
{
  "agent_api_key": "wa_live_key_a98f123bc4...",
  "agent_name": "Mera Munshi"
}
```
#### Response
```json
{
  "status": "connected",
  "message": "WhatsApp Agent successfully bridged to W2L engine."
}
```
