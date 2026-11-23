import { getDb } from '../db/connection.js';
import { parseWithGemini } from '../ai/gemini.js';
import { findPartiesByName, getPartyById, createParty } from '../ledger/partyManager.js';
import { recordLedgerTransaction, getDashboardKpis } from '../ledger/engine.js';
import { WhatsAppAgentInbound, WhatsAppAgentOutbound } from '@w2l/shared';

interface SessionRow {
  id: string;
  user_identifier: string;
  state: 'IDLE' | 'AWAITING_DISAMBIGUATION' | 'AWAITING_CONFIRMATION';
  pending_payload: string | null;
  expires_at: string;
}

export async function handleWhatsAppMessage(inbound: WhatsAppAgentInbound): Promise<WhatsAppAgentOutbound> {
  const db = getDb();
  const userId = inbound.sender.user_identifier || inbound.sender.user_id || 'default_user';
  const text = inbound.content.text || '';
  const now = new Date();

  // 1. Check existing active session for this user
  const session = db.prepare(`
    SELECT * FROM agent_sessions 
    WHERE user_identifier = ? AND expires_at > ?
  `).get(userId, now.toISOString()) as SessionRow | undefined;

  // Handle Multi-step Disambiguation (e.g., resolving 2 Bilals)
  if (session && session.state === 'AWAITING_DISAMBIGUATION' && session.pending_payload) {
    const payload = JSON.parse(session.pending_payload);
    const trimmed = text.trim();
    const chosenIndex = parseInt(trimmed, 10);

    if (!isNaN(chosenIndex) && chosenIndex > 0 && chosenIndex <= payload.candidates.length) {
      const selectedParty = payload.candidates[chosenIndex - 1];

      // Finalize the transaction with the selected party!
      const tx = recordLedgerTransaction({
        type: payload.type || 'EXPENSE',
        amount: payload.amount,
        category: payload.category || 'Misc',
        payment_method: payload.payment_method || 'CASH',
        party_id: selectedParty.id,
        party_name: selectedParty.name + (selectedParty.tag ? ` (${selectedParty.tag})` : ''),
        description: `${payload.type}: ${payload.amount} with ${selectedParty.name} (${selectedParty.tag})`,
        source_channel: 'WHATSAPP_TEXT',
        raw_input: text,
      });

      // Clear session state
      db.prepare('DELETE FROM agent_sessions WHERE id = ?').run(session.id);

      return {
        status: 'success',
        reply: {
          text: `✅ *Entry Confirmed*\n\n• Party: *${selectedParty.name} (${selectedParty.tag})*\n• Amount: *$${payload.amount.toLocaleString()}*\n• Category: *${payload.category}*\n• Type: *${payload.type}*\n\nTransaction #${tx.txId.substring(0, 8)} recorded successfully in your Ledger.`,
          requires_action: false,
        },
        recorded_transaction: tx,
      };
    } else {
      return {
        status: 'clarification_needed',
        reply: {
          text: `⚠️ Please enter a valid number (1 to ${payload.candidates.length}) to select the intended party.`,
          requires_action: true,
        },
      };
    }
  }

  // 2. Parse the incoming message using Multimodal Gemini 2.0 Flash
  const extracted = await parseWithGemini({
    text: inbound.content.text,
    audioBase64: inbound.content.media_base64 && inbound.type === 'audio' ? inbound.content.media_base64 : undefined,
    imageBase64: inbound.content.media_base64 && inbound.type === 'image' ? inbound.content.media_base64 : undefined,
    mimeType: inbound.content.mime_type,
  });

  // 3. Handle Greeting
  if (extracted.intent === 'GREETING') {
    return {
      status: 'success',
      reply: {
        text: `👋 Assalam-o-Alaikum! I am your *W2L Smart Munshi* (AI Ledger Assistant).\n\nYou can:\n• 🎙️ Send a voice note: *"Paid 1200 cash for fuel"*\n• 📸 Snap a receipt photo\n• 💬 Type any expense or sale: *"Sold 5k goods to Ali on credit"*\n• 📊 Ask questions: *"What is my balance?"* or *"Who owes me money?"*`,
        requires_action: false,
      },
    };
  }

  // 4. Handle Financial Questions (Q&A)
  if (extracted.intent === 'QUESTION') {
    if (extracted.party_name) {
      const parties = findPartiesByName(extracted.party_name);
      if (parties.length === 0) {
        return {
          status: 'success',
          reply: {
            text: `ℹ️ No records found for "${extracted.party_name}" in your Khata contacts.`,
            requires_action: false,
          },
        };
      }
      if (parties.length === 1) {
        const p = parties[0];
        const statusText = p.current_balance >= 0 ? `owes you (Receivable / Udhar)` : `you owe them (Payable)`;
        return {
          status: 'success',
          reply: {
            text: `📊 *Ledger Statement for ${p.name} ${p.tag ? '(' + p.tag + ')' : ''}*\n\n• Current Balance: *$${Math.abs(p.current_balance).toLocaleString()}*\n• Status: *${statusText}*\n• Phone: ${p.phone || 'N/A'}`,
            requires_action: false,
          },
        };
      }
      // If multiple parties match question
      const list = parties.map((p, i) => `${i + 1}️⃣ *${p.name}* (${p.tag}) - Bal: $${p.current_balance}`).join('\n');
      return {
        status: 'success',
        reply: {
          text: `Found multiple contacts for "${extracted.party_name}":\n\n${list}`,
          requires_action: false,
        },
      };
    }

    // General Financial Summary
    const kpis = getDashboardKpis();
    return {
      status: 'success',
      reply: {
        text: `📊 *Business Finance Summary*\n\n• 💰 *Total Revenue:* $${kpis.total_revenue.value.toLocaleString()}\n• 📉 *Total Expenses:* $${kpis.total_expenses.value.toLocaleString()}\n• 🟢 *Net Profit:* $${kpis.net_profit.value.toLocaleString()}\n• ⏳ *Pending Invoices:* ${kpis.pending_invoices.count} ($${kpis.pending_invoices.total_value.toLocaleString()})`,
        requires_action: false,
      },
    };
  }

  // 5. Handle Transactions
  if (extracted.intent === 'TRANSACTION') {
    if (!extracted.amount || extracted.amount <= 0) {
      return {
        status: 'clarification_needed',
        reply: {
          text: `⚠️ I could not recognize the amount. Please specify the amount, e.g.: *"Paid 500 for tea"* or *"Received 1500 from customer"*.`,
          requires_action: true,
        },
      };
    }

    // Party Matching and Disambiguation
    let targetPartyId: string | undefined;
    let targetPartyName = extracted.party_name;

    if (extracted.party_name) {
      const matches = findPartiesByName(extracted.party_name);

      if (matches.length > 1) {
        // AMBIGUITY DETECTED! (e.g. 2 Bilals)
        // Store in agent_sessions
        const sessionId = 'ses_' + Date.now().toString(36);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        db.prepare(`
          INSERT OR REPLACE INTO agent_sessions (id, user_identifier, state, pending_payload, expires_at)
          VALUES (?, ?, 'AWAITING_DISAMBIGUATION', ?, ?)
        `).run(
          sessionId,
          userId,
          JSON.stringify({
            amount: extracted.amount,
            type: extracted.type,
            category: extracted.category,
            payment_method: extracted.payment_method,
            candidates: matches,
          }),
          expiresAt
        );

        const optionsText = matches
          .map((m, idx) => `${idx + 1}️⃣ *${m.name}* (${m.tag || 'General'}) — Current Bal: $${m.current_balance}`)
          .join('\n');

        return {
          status: 'clarification_needed',
          reply: {
            text: `⚠️ *Multiple contacts found for "${extracted.party_name}"*:\n\n${optionsText}\n\n*Which one do you mean?* (Reply *1* or *2*)`,
            requires_action: true,
            suggested_actions: matches.map((_, i) => String(i + 1)),
          },
        };
      } else if (matches.length === 1) {
        targetPartyId = matches[0].id;
        targetPartyName = matches[0].name + (matches[0].tag ? ` (${matches[0].tag})` : '');
      } else {
        // Auto-create new contact
        const newParty = createParty(extracted.party_name, '', 'Client');
        targetPartyId = newParty.id;
      }
    }

    // Commit Transaction
    const tx = recordLedgerTransaction({
      type: extracted.type || 'EXPENSE',
      amount: extracted.amount,
      category: extracted.category || 'Misc',
      payment_method: extracted.payment_method || 'CASH',
      party_id: targetPartyId,
      party_name: targetPartyName,
      description: `${extracted.type}: $${extracted.amount} (${extracted.category})${targetPartyName ? ' - ' + targetPartyName : ''}`,
      source_channel: inbound.type === 'audio' ? 'WHATSAPP_VOICE' : inbound.type === 'image' ? 'WHATSAPP_IMAGE' : 'WHATSAPP_TEXT',
      raw_input: text,
    });

    const typeEmoji = extracted.type === 'INCOME' ? '💰' : '📉';

    return {
      status: 'success',
      reply: {
        text: `✅ *Entry Recorded in Ledger*\n\n${typeEmoji} *Type:* ${extracted.type}\n• *Amount:* $${extracted.amount.toLocaleString()}\n• *Category:* ${extracted.category}\n• *Payment:* ${extracted.payment_method}\n${targetPartyName ? `• *Party:* ${targetPartyName}\n` : ''}• *Tx ID:* #${tx.txId.substring(0, 8)}\n\nYour live dashboard has been updated.`,
        requires_action: false,
      },
      recorded_transaction: tx,
    };
  }

  return {
    status: 'success',
    reply: {
      text: `Received: "${text}". Send an expense, voice note, or bill photo to log it into your ledger!`,
      requires_action: false,
    },
  };
}
