# Software Requirements Specification (SRS)
## Project Name: W2L (WhatsApp to Ledger)
### Document Version: 1.0.0
### Standard: Conforms to IEEE 830 Standards for SRS

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) specifies the software requirements for the **W2L (WhatsApp to Ledger)** system. W2L provides automated financial logging from WhatsApp chats (supporting text, voice notes, and image receipts) into a structured double-entry ledger, presented through a clean web-based business finance dashboard.

### 1.2 Scope
The scope of W2L encompasses:
1. Integration with WhatsApp's native **Third-Party Agent API** (using user-generated API keys).
2. Multimodal data ingestion (Audio, Images, Natural Language Text) handled by **Google Gemini 2.0 Flash**.
3. Automated entity extraction, transaction categorization, and party disambiguation (e.g., distinguishing multiple contacts with identical names).
4. An ACID-compliant double-entry accounting engine implemented on **SQLite**.
5. A high-fidelity Web Dashboard presenting Real-time KPIs (Total Revenue, Expenses, Net Profit, Pending Invoices/Udhar), Cash Flow Visualizations, and Transaction Histories.

### 1.3 Definitions, Acronyms, and Abbreviations
* **MSME:** Micro, Small, and Medium Enterprises.
* **Khata / Udhar:** Traditional South Asian credit ledger tracking debts owed by or to a business.
* **OCR:** Optical Character Recognition.
* **Double-Entry:** Accounting methodology where every transaction updates at least two accounts (Debits equal Credits).
* **Gemini Flash:** Google's multimodal generative AI model optimized for low-latency audio, visual, and text comprehension.
* **Party:** An external individual or corporate entity (Customer, Supplier, Employee, Contractor).

---

## 2. Overall Description

### 2.1 Product Perspective
W2L functions as a standalone, self-hosted or cloud-hosted accounting agent. It interfaces on the front end with WhatsApp's native third-party agent interface and renders an interactive web UI for ledger analytics.

```
┌────────────────────────────────────────────────────────┐
│               WhatsApp Native App Client               │
│      (User speaks voice notes / sends bill photos)     │
└───────────────────────────┬────────────────────────────┘
                            │ (Agent API Key Webhook / Polling)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   W2L Core Engine                      │
│   ┌────────────────────────────────────────────────┐   │
│   │           WhatsApp Ingestion Service           │   │
│   └───────────────────────┬────────────────────────┘   │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │       Multimodal AI Agent (Gemini 2.0)         │   │
│   └───────────────────────┬────────────────────────┘   │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │   Ledger Accounting & Disambiguation Engine    │   │
│   └───────────────────────┬────────────────────────┘   │
│                           ▼                            │
│   ┌────────────────────────────────────────────────┐   │
│   │           SQLite Database Engine               │   │
│   └───────────────────────┬────────────────────────┘   │
└───────────────────────────┼────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               Web Finance Dashboard UI                 │
│         (Revenue, Expenses, Profit, Invoices)          │
└────────────────────────────────────────────────────────┘
```

### 2.2 User Classes and Characteristics
1. **Business Owner / Cashier (Primary User):** Uses WhatsApp for instant on-the-go data capture; uses the Web Dashboard for daily review and month-end settlement.
2. **Accountant / Auditor:** Uses the Web Dashboard to audit transaction items, inspect raw receipt images, export reports, and adjust ledger entries.

### 2.3 Operating Environment
* **Server Environment:** Node.js v18.0.0+ on Linux / Windows / macOS.
* **Client Environment (Web Dashboard):** Modern Evergreen Browsers (Chrome, Firefox, Safari, Edge) on Desktop and Mobile viewport sizes.
* **Messaging Platform:** WhatsApp for Android / iOS supporting Third-Party Agent integrations.

---

## 3. Specific Requirements (Functional)

### 3.1 WhatsApp Agent Integration Module (WA-FR)
* **WA-FR-1 (Authentication):** The system shall authenticate agent requests using the WhatsApp Agent API Key generated from WhatsApp Settings > Agents.
* **WA-FR-2 (Message Routing):** The system shall identify the incoming message payload type: `text`, `audio/voice`, or `image`.
* **WA-FR-3 (Context Persistence):** The system shall maintain a conversation session thread to handle multi-step interactions (such as clarifications and confirmations).
* **WA-FR-4 (Confirmation Dispatch):** The system shall return a human-readable confirmation message to the WhatsApp chat upon successful transaction creation within $\le 3$ seconds.

### 3.2 Multimodal AI Ingestion Module (AI-FR)
* **AI-FR-1 (Voice Note Processing):** The system shall pass raw audio streams directly to Gemini 2.0 Flash to extract transaction intent without requiring a standalone Whisper transcription microservice.
* **AI-FR-2 (Receipt OCR Processing):** The system shall feed image buffers into Gemini 2.0 Flash to extract Vendor Name, Transaction Date, Tax Amount, Individual Line Items, and Total Amount.
* **AI-FR-3 (Structured Output):** The AI Agent shall execute schema-validated Tool Calls (`record_transaction`, `query_ledger`, `disambiguate_party`, `get_summary`) with strongly-typed arguments.
* **AI-FR-4 (Multi-language Comprehension):** The system shall accurately comprehend mixed linguistic inputs, including English, Urdu (Nastaliq & Roman Urdu), Hindi, and Arabic idioms for commerce (e.g., *udhar*, *jama*, *naam*, *khata*, *rokarr*).

### 3.3 Entity Disambiguation Engine (ED-FR)
* **ED-FR-1 (Fuzzy Name Resolution):** When a user specifies a party name (e.g., *"Bilal"*), the system shall search existing parties using Levenshtein distance and phonetic matching.
* **ED-FR-2 (Conflict Detection):** If multiple parties match the query criteria with ambiguous confidence ($< 90\%$ difference), the system shall suspend transaction finalization.
* **ED-FR-3 (Interactive Prompting):** The system shall send a numbered multi-choice reply on WhatsApp:
  * Example: *"Found 2 Bilals: 1) Bilal Electrician (Bal: Rs 1,500) 2) Bilal Cloth (Bal: Rs 12,000). Reply 1 or 2."*
* **ED-FR-4 (New Party Onboarding):** If no match is found, the system shall automatically create a candidate party and confirm with the user.

### 3.4 Ledger & Accounting Engine (LA-FR)
* **LA-FR-1 (Double-Entry Enforcement):** Every entry must adhere to balancing equations:
  $$\text{Assets} = \text{Liabilities} + \text{Equity}$$
* **LA-FR-2 (Account Types):** The engine shall support account classifications:
  * `ASSET` (Cash on Hand, Bank Account)
  * `LIABILITY` (Accounts Payable, Supplier Dues)
  * `EQUITY` (Capital, Owner's Drawings)
  * `REVENUE` (Sales, Service Fees, Other Income)
  * `EXPENSE` (Inventory, Utilities, Rent, Logistics, Salary)
* **LA-FR-3 (Transaction Atomicity):** Ingestion must execute within ACID transactions; failure in writing receipt metadata shall roll back debit/credit allocations.

### 3.5 Web Finance Dashboard (WD-FR)
* **WD-FR-1 (Metric KPI Cards):** The web dashboard shall present 4 live cards:
  1. **Total Revenue** (with period comparison $\Delta \%$)
  2. **Total Expenses** (with period comparison $\Delta \%$)
  3. **Net Profit** (Calculated as $\text{Revenue} - \text{Expenses}$)
  4. **Pending Invoices / Udhar** (Outstanding receivables count and total balance)
* **WD-FR-2 (Revenue Overview Chart):** Interactive monthly/weekly bar chart visualizing comparative Revenue vs Expenses.
* **WD-FR-3 (Expense Breakdown Visualizer):** Segmented progress visualization showing percentage and absolute allocation by expense category.
* **WD-FR-4 (Invoice & Receivables Table):** Table listing Invoice ID, Client, Service/Item, Status (`Paid`, `Pending`, `Overdue`), Amount, Due Date, and Actions.
* **WD-FR-5 (Recent Transactions Feed):** Chronological log of recent activities with source tags (`WhatsApp Voice`, `WhatsApp Image`, `Manual Web`).
* **WD-FR-6 (Agent Configuration Modal):** A dedicated settings section allowing the user to view/enter their WhatsApp Agent API Key and test connection heartbeat.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Latency
* **NFR-1:** WhatsApp response latency must not exceed 3 seconds from webhook arrival to outbound reply.
* **NFR-2:** The Web Dashboard initial render (First Contentful Paint) must be $< 1.2$ seconds on a standard 4G connection.
* **NFR-3:** SQLite queries for 100,000 transactions must return aggregate metrics in $< 50\text{ ms}$.

### 4.2 Security & Data Privacy
* **NFR-4:** WhatsApp Agent API keys must be encrypted at rest using AES-256-GCM.
* **NFR-5:** Financial records shall never be transmitted to third parties other than the prompt payload required by the Gemini API under user-approved privacy policies.
* **NFR-6:** Uploaded receipt images shall be stored locally in an access-controlled directory with UUID-based anonymization.

### 4.3 Zero-Cost Operational Constraint
* **NFR-7:** The software must run without mandatory paid third-party subscriptions. All runtime capabilities must operate within free API tiers (Google AI Studio Free Tier, SQLite embedded engine, self-hosted web server).
