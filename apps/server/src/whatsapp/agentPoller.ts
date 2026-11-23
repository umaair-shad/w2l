import { config } from '../config.js';
import { handleWhatsAppMessage } from './agentGateway.js';

let isPolling = false;
let nextOffset: number | undefined = undefined;

async function downloadWhatsAppMedia(mediaId: string): Promise<{ base64: string; mimeType: string } | null> {
  const token = config.whatsappAgentApiKey;
  if (!token) return null;

  try {
    const metaRes = await fetch(`https://api.whatsapp.com/agent/v1/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!metaRes.ok) return null;
    const metaData: any = await metaRes.json();
    const downloadUrl = metaData.url || `https://api.whatsapp.com/agent/v1/media/${mediaId}`;

    const fileRes = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!fileRes.ok) return null;
    const buf = await fileRes.arrayBuffer();
    const base64 = Buffer.from(buf).toString('base64');
    const mimeType = metaData.mime_type || fileRes.headers.get('content-type') || 'application/octet-stream';

    return { base64, mimeType };
  } catch (err) {
    console.warn(`⚠️ Could not download media ${mediaId}:`, err);
    return null;
  }
}

export async function sendWhatsAppReply(to: string, text: string) {
  if (!config.whatsappAgentApiKey) return;

  try {
    const res = await fetch('https://api.whatsapp.com/agent/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.whatsappAgentApiKey}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('❌ Failed to send WhatsApp outbound reply:', res.status, err);
    } else {
      console.log(`📤 Reply delivered to WhatsApp user (${to})`);
    }
  } catch (err) {
    console.error('❌ Network error sending WhatsApp reply:', err);
  }
}

export async function sendTypingIndicator(messageId: string) {
  if (!config.whatsappAgentApiKey) return;
  try {
    await fetch('https://api.whatsapp.com/agent/v1/statuses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.whatsappAgentApiKey}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
        typing_indicator: { type: 'text' },
      }),
    });
  } catch (e) {}
}

export async function pollWhatsAppUpdates() {
  const token = config.whatsappAgentApiKey;
  if (!token || token.startsWith('wa_demo_')) {
    console.log('ℹ️ WhatsApp Agent Poller: Demo mode active. Set live WHATSAPP_AGENT_API_KEY to connect to Meta.');
    return;
  }

  isPolling = true;
  console.log('🔄 WhatsApp Agent Poller: Connecting to Meta Agent Platform (https://api.whatsapp.com/agent/v1/updates)...');
  console.log('📡 WhatsApp Agent Poller: Live listener started. Ready to receive messages from your WhatsApp!');

  while (isPolling) {
    try {
      const url = new URL('https://api.whatsapp.com/agent/v1/updates');
      url.searchParams.set('limit', '50');
      url.searchParams.set('timeout', '15');
      if (nextOffset !== undefined) {
        url.searchParams.set('offset', String(nextOffset));
      }

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        // No new messages during long-poll window, loop and poll again
        continue;
      }

      if (res.status === 401 || res.status === 400) {
        console.warn(`⚠️ WhatsApp Agent Auth Error (${res.status}): Please verify the API token from WhatsApp.`);
        await new Promise((r) => setTimeout(r, 10000));
        continue;
      }

      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 5000));
        continue;
      }

      const data: any = await res.json();
      if (data.next_offset !== undefined) {
        nextOffset = data.next_offset;
      }

      // Collect all messages from standard Meta webhook entry structure or direct updates array
      const rawMessages: any[] = [];

      if (data.entry && Array.isArray(data.entry)) {
        for (const entry of data.entry) {
          if (entry.changes && Array.isArray(entry.changes)) {
            for (const change of entry.changes) {
              const value = change.value;
              if (value && value.messages && Array.isArray(value.messages)) {
                for (const msg of value.messages) {
                  rawMessages.push(msg);
                }
              }
            }
          }
        }
      } else if (data.messages && Array.isArray(data.messages)) {
        rawMessages.push(...data.messages);
      } else if (data.updates && Array.isArray(data.updates)) {
        rawMessages.push(...data.updates);
      }

      for (const msg of rawMessages) {
        const senderId = msg.from; // e.g. "user:50972923564215"
        const messageId = msg.id;

        console.log(`\n📩 Inbound WhatsApp Message from ${senderId}:`);

        // Mark as read & show typing indicator
        await sendTypingIndicator(messageId);

        let inboundText = '';
        let inboundType: 'text' | 'audio' | 'image' = 'text';
        let mediaBase64: string | undefined = undefined;
        let mediaMimeType: string | undefined = undefined;

        if (msg.type === 'text' && msg.text) {
          inboundText = msg.text.body;
          inboundType = 'text';
          console.log(`• Text: "${inboundText}"`);
        } else if (msg.type === 'audio' && msg.audio) {
          inboundType = 'audio';
          console.log(`• Voice Note Received (Media ID: ${msg.audio.id})`);
          const downloaded = await downloadWhatsAppMedia(msg.audio.id);
          if (downloaded) {
            mediaBase64 = downloaded.base64;
            mediaMimeType = downloaded.mimeType;
          }
        } else if (msg.type === 'image' && msg.image) {
          inboundType = 'image';
          inboundText = msg.image.caption || '';
          console.log(`• Receipt Image Received (Media ID: ${msg.image.id})`);
          const downloaded = await downloadWhatsAppMedia(msg.image.id);
          if (downloaded) {
            mediaBase64 = downloaded.base64;
            mediaMimeType = downloaded.mimeType;
          }
        }

        // Process with W2L Engine (Gemini / Ledger / Disambiguation)
        const outbound = await handleWhatsAppMessage({
          message_id: messageId,
          timestamp: parseInt(msg.timestamp || '0', 10),
          sender: {
            user_id: senderId,
            display_name: 'WhatsApp User',
          },
          type: inboundType,
          content: {
            text: inboundText,
            media_base64: mediaBase64,
            mime_type: mediaMimeType,
          },
        });

        // Deliver reply directly back to user on WhatsApp
        if (outbound.reply && outbound.reply.text) {
          await sendWhatsAppReply(senderId, outbound.reply.text);
        }
      }
    } catch (err) {
      console.error('⚠️ Error in WhatsApp long-poll loop:', err);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

export function stopWhatsAppPoller() {
  isPolling = false;
}
