# W2L (WhatsApp to Ledger) 🚀

> **AI-Powered Autonomous Bookkeeper & Business Finance Dashboard**  
> An enterprise-grade, zero-investment ($0 budget) financial intelligence system bridging WhatsApp native third-party agents with a modern web dashboard.

![Lukana Business Finance Dashboard](docs/dashboard-preview.png)

---

## 🌟 Key Features

1. **Native WhatsApp Third-Party Agent Integration**
   - Connects directly via WhatsApp's native **"Third-Party Agents"** API key system (`Settings` > `Agents` > `Add an agent`).
   - Zero phone numbers shared, zero Meta BSP fees, zero risk of phone number bans.
2. **Multimodal AI Brain (Google Gemini 2.0 Flash - 100% Free Tier)**
   - 🎙️ **Voice Notes**: Speech-to-transaction intent in English, Urdu/Hindi, Arabic, and mixed idioms.
   - 📸 **Receipt / Invoice OCR**: Extracts Vendor, Date, Line Items, and Total Amount from photos.
   - 💬 **Natural Language**: Understands quick informal logs (*"Paid 1200 for petrol"* or *"Sold 5k to Ali on credit"*).
3. **Smart Entity Disambiguation**
   - Solves the duplicate name problem (e.g. distinguishing between *Bilal Electrician* vs *Bilal Cloth Merchant*) with interactive prompts.
4. **ACID Double-Entry Accounting Core**
   - Zero-dependency, ultra-fast embedded SQLite database running in WAL mode.
5. **Modern Web Finance Dashboard**
   - Replicates the Lukana Business Finance UI:
     - 4 Top KPI Cards (Total Revenue, Total Expenses, Net Profit, Pending Invoices).
     - Monthly Revenue vs Expenses Bar Chart.
     - Categorized Expense Breakdown progress bar.
     - Live Client Invoices and Recent Expenses feed.
     - Built-in WhatsApp Agent live test simulator.

---

## 📁 Monorepo Structure

```
w2l/
├── apps/
│   ├── web/               # React + Vite + Tailwind CSS Dashboard
│   └── server/            # Node.js + Express + SQLite + Gemini 2.0 Flash
├── packages/
│   └── shared/            # Shared TypeScript types, schemas & DTOs
├── docs/                  # Comprehensive documentation suite
│   ├── PRD.md             # Product Requirements & Zero-Cost Strategy
│   ├── SRS.md             # Software Requirements Specification (IEEE 830)
│   ├── SDD.md             # Software Design Document & System Architecture
│   ├── DATABASE_SCHEMA.md # Database ERD, Tables & DDL Script
│   └── API_SPEC.md        # WhatsApp Ingestion & Gemini Function Calling Specs
├── package.json           # Monorepo workspaces config
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create an `.env` file in `apps/server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_free_google_ai_studio_api_key_here
WHATSAPP_AGENT_API_KEY=wa_demo_live_key_98214
```
*(Note: If no Gemini API key is provided, W2L automatically runs using its built-in deterministic NLP engine!)*

### 3. Run Development Servers
```bash
# Run both Backend API (port 5000) and Web Dashboard (port 3000)
npm run dev

# Or run separately:
npm run dev:server
npm run dev:web
```

Open `http://localhost:3000` in your browser.

---

## 👥 Handling Multiple Contacts (The "2 Bilals" Problem)

When a user logs a transaction with an ambiguous name:
> **User:** *"Give 5000 to Bilal"*  
> **W2L Agent:**  
> *"⚠️ Multiple contacts found for 'Bilal':*  
> *1️⃣ Bilal Electrician (Bal: $1,500)*  
> *2️⃣ Bilal Cloth Merchant (Bal: $12,000)*  
> *Which one do you mean? (Reply 1 or 2)"*

When the user replies `1`, W2L allocates the transaction to Bilal Electrician and commits the ledger entry.
