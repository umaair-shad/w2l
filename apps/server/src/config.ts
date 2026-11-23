import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate root data directory reliably
const rootDir = path.resolve(process.cwd(), process.cwd().endsWith('server') ? '../../' : '.');

// Robustly load .env from root or apps/server
const candidateEnvPaths = [
  path.resolve(rootDir, '.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps', 'server', '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}
const dataDir = path.resolve(rootDir, 'data');
const uploadsDir = path.resolve(dataDir, 'uploads');
const receiptsDir = path.resolve(uploadsDir, 'receipts');
const audioDir = path.resolve(uploadsDir, 'audio');

// Ensure directories exist safely
try {
  for (const dir of [dataDir, uploadsDir, receiptsDir, audioDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
} catch (e) {
  // If sandbox permission delays directory creation, ignore here
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  dbPath: process.env.DB_PATH || path.resolve(dataDir, 'ledger.sqlite'),
  uploadsDir,
  receiptsDir,
  audioDir,
  whatsappAgentApiKey: process.env.WHATSAPP_AGENT_API_KEY || 'wa_demo_live_key_98214',
};
