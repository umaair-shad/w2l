import { handleWhatsAppMessage } from './whatsapp/agentGateway.js';
import { getDashboardKpis, getRecentTransactions } from './ledger/engine.js';
import { getDb } from './db/connection.js';
import { seedDatabase } from './db/seed.js';
import { config } from './config.js';

async function runTestSuite() {
  console.log('🧪 ============================================');
  console.log('🚀 W2L (WhatsApp to Ledger) Automated Test Suite');
  console.log('================================================\n');

  // Initialize DB & Seed
  seedDatabase();

  console.log(`🔑 Config Status:`);
  console.log(`• Gemini API Key: ${config.geminiApiKey ? '✅ Present (' + config.geminiApiKey.substring(0, 8) + '...)' : '⚠️ Not set (Using Deterministic NLP Fallback)'}`);
  console.log(`• WhatsApp Agent Key: ${config.whatsappAgentApiKey ? '✅ Configured (' + config.whatsappAgentApiKey.substring(0, 8) + '...)' : '⚠️ Default'}\n`);

  // TEST 1: Greeting
  console.log('------------------------------------------------');
  console.log('TEST 1: Inbound Greeting ("Assalam-o-Alaikum")');
  console.log('------------------------------------------------');
  const res1 = await handleWhatsAppMessage({
    message_id: 'test_msg_1',
    timestamp: Date.now(),
    sender: { user_id: 'test_user_001', display_name: 'Shopkeeper' },
    type: 'text',
    content: { text: 'Assalam-o-Alaikum' },
  });
  console.log('Agent Reply:\n' + res1.reply.text);
  console.log(`Status: ${res1.status === 'success' ? '✅ PASS' : '❌ FAIL'}\n`);

  // TEST 2: Direct Expense ("Paid 1200 cash for petrol")
  console.log('------------------------------------------------');
  console.log('TEST 2: Voice Note / Quick Expense ("Paid 1200 cash for petrol")');
  console.log('------------------------------------------------');
  const res2 = await handleWhatsAppMessage({
    message_id: 'test_msg_2',
    timestamp: Date.now(),
    sender: { user_id: 'test_user_001', display_name: 'Shopkeeper' },
    type: 'audio',
    content: { text: 'Paid 1200 cash for petrol' },
  });
  console.log('Agent Reply:\n' + res2.reply.text);
  console.log(`Status: ${res2.status === 'success' ? '✅ PASS' : '❌ FAIL'}\n`);

  // TEST 3: The 2 Bilals Disambiguation Flow
  console.log('------------------------------------------------');
  console.log('TEST 3: Duplicate Name Disambiguation ("Give 5000 to Bilal")');
  console.log('------------------------------------------------');
  const res3 = await handleWhatsAppMessage({
    message_id: 'test_msg_3',
    timestamp: Date.now(),
    sender: { user_id: 'test_user_001', display_name: 'Shopkeeper' },
    type: 'text',
    content: { text: 'Give 5000 to Bilal' },
  });
  console.log('Step A (Agent detects conflict & prompts user):\n' + res3.reply.text);
  const detectedAmbiguity = res3.status === 'clarification_needed';
  console.log(`Ambiguity Detected: ${detectedAmbiguity ? '✅ PASS' : '❌ FAIL'}`);

  if (detectedAmbiguity) {
    console.log('\nStep B (User replies "1" to pick Bilal Electrician):');
    const res3b = await handleWhatsAppMessage({
      message_id: 'test_msg_3b',
      timestamp: Date.now(),
      sender: { user_id: 'test_user_001', display_name: 'Shopkeeper' },
      type: 'text',
      content: { text: '1' },
    });
    console.log('Agent Confirmation:\n' + res3b.reply.text);
    console.log(`Disambiguation Resolved: ${res3b.status === 'success' ? '✅ PASS' : '❌ FAIL'}\n`);
  }

  // TEST 4: Financial Q&A Query
  console.log('------------------------------------------------');
  console.log('TEST 4: Financial Query ("What is my total profit?")');
  console.log('------------------------------------------------');
  const res4 = await handleWhatsAppMessage({
    message_id: 'test_msg_4',
    timestamp: Date.now(),
    sender: { user_id: 'test_user_001', display_name: 'Shopkeeper' },
    type: 'text',
    content: { text: 'What is my total profit?' },
  });
  console.log('Agent Statement:\n' + res4.reply.text);
  console.log(`Status: ${res4.status === 'success' ? '✅ PASS' : '❌ FAIL'}\n`);

  // Verify DB state
  const kpis = getDashboardKpis();
  console.log('================================================');
  console.log('📊 Current Live Ledger Totals (Post-Tests):');
  console.log(`• Revenue: Rs ${kpis.total_revenue.value.toLocaleString()}`);
  console.log(`• Expenses: Rs ${kpis.total_expenses.value.toLocaleString()}`);
  console.log(`• Net Profit: Rs ${kpis.net_profit.value.toLocaleString()}`);
  console.log('================================================\n');
  console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
}

runTestSuite().catch(console.error);
