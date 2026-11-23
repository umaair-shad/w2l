# Product Requirements Document (PRD)
## Project Name: W2L (WhatsApp to Ledger)
### Tagline: AI-Powered Autonomous Bookkeeper & Financial Dashboard for Small Businesses

---

## 1. Executive Summary
**W2L (WhatsApp to Ledger)** is an intelligent financial management platform engineered for micro, small, and medium businesses (MSMEs), shopkeepers, contractors, and freelancers. It bridges everyday informal business communications on WhatsApp with a modern, high-precision web financial dashboard.

Users interact with an autonomous AI Agent directly inside WhatsApp—transmitting voice notes, taking photos of paper bills and receipts, or texting quick transaction memos. The agent leverages Google Gemini 2.0 Flash (Free Multimodal AI) to extract transaction mechanics, resolve ambiguous entities, and log entries into an internal double-entry ledger. Concurrently, business owners monitor real-time key performance indicators (Revenue, Expenses, Net Profit, Receivables/Udhar), cash-flow curves, and invoices through a sleek, web-based management dashboard.

---

## 2. Problem Statement
1. **Friction in Traditional Accounting Software:** Small merchants and solo entrepreneurs abandon complex ERPs (QuickBooks, Xero) due to excessive data-entry overhead and complex interfaces.
2. **Loss of Expense History:** Over 60% of daily micro-expenses (fuel, daily labor, cash supplies, logistics) are forgotten before manual entry into physical registers (*khata*).
3. **Receipt Decay:** Physical paper thermal receipts fade, tear, or get lost within days, resulting in untracked costs and unverified accounts.
4. **Disorganized Customer Credit (*Udhar*):** Shopkeepers struggle to keep track of who owes what, leading to cash-flow blockages and customer disputes.
5. **Budget Constraints:** Bootstrapped startups and micro-enterprises cannot afford monthly software subscriptions or expensive enterprise WhatsApp APIs.

---

## 3. Product Vision & Zero-Cost ($0) Strategy
Deliver a production-grade, enterprise-quality autonomous financial assistant with **zero upfront investment and $0 recurring SaaS infrastructure bills**:

* **WhatsApp Native Agent Integration:** Connects via WhatsApp’s native **"Third-Party Agents"** API key system directly inside the app, avoiding Meta business verification, phone number disclosure, or BSP monthly fees.
* **Multimodal Intelligence:** 100% powered by the generous free tier of **Google Gemini 2.0 Flash** (handling Voice Transcription, OCR Vision, NLP Classification, and Conversational Q&A in a unified token pool).
* **Storage Engine:** Local, zero-cost, high-performance ACID **SQLite** database with automated cloud backups (JSON/SQLite sync).
* **Modern Web Dashboard:** Custom-built React/Next.js responsive SPA with Tailwind CSS and Recharts—eliminating reliance on third-party spreadsheet workarounds.

---

## 4. User Personas

### Persona A: Muhammad Bilal (Retail Shop Owner)
* **Profile:** Runs a busy electrical hardware store with high foot-traffic.
* **Behavior:** Constantly on his feet, accepts cash and bank transfers, issues credit to trusted contractors.
* **Pain Point:** Has no time to sit at a laptop during the day; forgets cash payouts to suppliers.
* **W2L Usage:** Sends a 5-second voice note into his WhatsApp agent between customer visits: *"Paid 1500 to Nasir for courier"*. In the evening, views his net profit on the web dashboard.

### Persona B: Ayesha Khan (Freelance Agency Lead)
* **Profile:** Operates a boutique design studio with 4 remote team members.
* **Behavior:** Invoices clients monthly, pays software subscriptions and contractor fees.
* **Pain Point:** Lost track of pending client payments and business expenses across multiple platforms.
* **W2L Usage:** Forwards screenshots of digital invoices to the WhatsApp agent, and uses the web dashboard to manage pending receivables and cash-flow projections.

---

## 5. Core Feature Matrix

| Module | WhatsApp Agent Interface | Web Management Dashboard |
| :--- | :--- | :--- |
| **Voice Processing** | Direct audio note comprehension in English, Urdu, Hindi, and regional mixes. | Audio transcript review and raw snippet replay. |
| **Receipt / OCR** | Photos of thermal paper, handwritten notes, printed invoices. | Downloadable original receipt archive linked to transactions. |
| **NLP Quick Entry** | Freeform text parsing (*"Sold 4 bags to Ali for 8000 on credit"*). | Manual transaction modal with category pickers. |
| **Entity Disambiguation** | Interactive multi-party disambiguation prompts (e.g. resolving 2 Bilals). | Party / Customer Khata management with credit limits. |
| **Financial Q&A** | Instant natural language queries (*"What is my profit this week?"*). | Comprehensive KPI cards, Bar Charts, Category Breakdowns. |
| **Invoicing & Udhar** | Notification alerts for due payments and outstanding balances. | Status tagging: `Paid`, `Pending`, `Overdue` with date pickers. |

---

## 6. Success Metrics & KPIs
1. **Extraction Accuracy:** $\ge 96\%$ accuracy in extracting Amount, Currency, Category, and Party from voice notes and receipts.
2. **Latency:** Under 2.5 seconds end-to-end response time on WhatsApp from message receipt to ledger confirmation.
3. **Disambiguation Safety:** $0\%$ silent misattributions for identical customer names.
4. **Zero-Cost Compliance:** Operational infrastructure cost strictly remaining $0.00 during MVP and initial 50-shop rollout.
