import { Router } from 'express';
import multer from 'multer';
import { handleWhatsAppMessage } from '../whatsapp/agentGateway.js';
import { config } from '../config.js';
import { WhatsAppAgentInbound } from '@w2l/shared';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export const whatsappRouter = Router();

// 1. Official Webhook for WhatsApp Third-Party Agent API Key integration
whatsappRouter.post('/webhook', upload.single('media'), async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    // Allow either Bearer token or direct simulator call
    if (authHeader && !authHeader.includes(config.whatsappAgentApiKey)) {
      console.warn('⚠️ Incoming request with unverified WhatsApp Agent API key');
    }

    let inbound: WhatsAppAgentInbound = req.body;

    // Handle multipart uploads (audio or image)
    if (req.file) {
      const isAudio = req.file.mimetype.startsWith('audio');
      inbound = {
        message_id: 'msg_' + Date.now(),
        timestamp: Math.floor(Date.now() / 1000),
        sender: {
          user_id: req.body.user_id || 'whatsapp_user_1',
          display_name: req.body.display_name || 'Business Owner',
        },
        type: isAudio ? 'audio' : 'image',
        content: {
          text: req.body.text || '',
          mime_type: req.file.mimetype,
          media_base64: req.file.buffer.toString('base64'),
        },
      };
    }

    const outbound = await handleWhatsAppMessage(inbound);
    res.json(outbound);
  } catch (err: any) {
    console.error('Error handling WhatsApp message:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// 2. Interactive Simulator Endpoint (allows live simulation directly from the Web Dashboard)
whatsappRouter.post('/simulate', upload.single('media'), async (req, res) => {
  try {
    let inbound: WhatsAppAgentInbound;

    if (req.file) {
      const isAudio = req.file.mimetype.startsWith('audio');
      inbound = {
        message_id: 'sim_' + Date.now(),
        timestamp: Math.floor(Date.now() / 1000),
        sender: {
          user_id: req.body.user_id || 'test_merchant_001',
          display_name: 'Store Owner (Simulator)',
        },
        type: isAudio ? 'audio' : 'image',
        content: {
          text: req.body.text || '',
          mime_type: req.file.mimetype,
          media_base64: req.file.buffer.toString('base64'),
        },
      };
    } else {
      inbound = {
        message_id: 'sim_' + Date.now(),
        timestamp: Math.floor(Date.now() / 1000),
        sender: {
          user_id: req.body.user_id || 'test_merchant_001',
          display_name: 'Store Owner (Simulator)',
        },
        type: req.body.type || 'text',
        content: {
          text: req.body.text || '',
          media_base64: req.body.media_base64,
          mime_type: req.body.mime_type,
        },
      };
    }

    const outbound = await handleWhatsAppMessage(inbound);
    res.json(outbound);
  } catch (err: any) {
    console.error('Error in simulator:', err);
    res.status(500).json({ status: 'error', error: err.message });
  }
});
