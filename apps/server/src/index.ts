import dns from 'node:dns';
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { seedDatabase } from './db/seed.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { whatsappRouter } from './routes/whatsappRoutes.js';
import { pollWhatsAppUpdates } from './whatsapp/agentPoller.js';

// Resolve IPv4 first to prevent Windows ISP IPv6 connect timeouts on api.whatsapp.com
dns.setDefaultResultOrder('ipv4first');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize & Seed Database
seedDatabase();

// Route Mounts
app.use('/api/dashboard', dashboardRouter);
app.use('/api/whatsapp', whatsappRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'W2L (WhatsApp to Ledger) Autonomous Engine',
    timestamp: new Date().toISOString(),
  });
});

app.listen(config.port, () => {
  console.log(`🚀 W2L Server listening on http://localhost:${config.port}`);
  console.log(`📡 WhatsApp Agent Webhook active at http://localhost:${config.port}/api/whatsapp/webhook`);

  // Start Long-Polling WhatsApp Agent Platform updates
  pollWhatsAppUpdates().catch((err) => {
    console.error('❌ Error initializing WhatsApp Agent Poller:', err);
  });
});
