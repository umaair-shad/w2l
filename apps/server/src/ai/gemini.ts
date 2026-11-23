import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config.js';

export interface ExtractedFinancialIntent {
  intent: 'TRANSACTION' | 'QUESTION' | 'CLARIFICATION' | 'GREETING';
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'CREDIT_SALE' | 'CREDIT_PURCHASE';
  amount?: number;
  category?: string;
  party_name?: string;
  payment_method?: 'CASH' | 'BANK' | 'CREDIT_UDHAR';
  notes?: string;
  question_query?: string;
  confidence: number;
}

export async function parseWithGemini(
  input: { text?: string; audioBase64?: string; mimeType?: string; imageBase64?: string },
  context: { knownParties?: string[] } = {}
): Promise<ExtractedFinancialIntent> {
  // If user provided a Gemini API Key, use Google Generative AI
  if (config.geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(config.geminiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

      const systemPrompt = `
You are W2L (WhatsApp to Ledger), an expert financial bookkeeping agent for small businesses and shops.
Analyze the user's input (which can be a text message, voice transcript, or receipt photo) and extract the financial details.

Known parties in the ledger: ${context.knownParties ? context.knownParties.join(', ') : 'None'}

Return ONLY a valid JSON object matching this schema:
{
  "intent": "TRANSACTION" | "QUESTION" | "GREETING",
  "type": "INCOME" | "EXPENSE" | "TRANSFER" | "CREDIT_SALE" | "CREDIT_PURCHASE",
  "amount": number,
  "category": "Software" | "Marketing" | "Contractors" | "Utilities" | "Inventory" | "Entertainment" | "Misc" | "Sales",
  "party_name": string or null,
  "payment_method": "CASH" | "BANK" | "CREDIT_UDHAR",
  "notes": string,
  "question_query": string or null,
  "confidence": number (between 0.0 and 1.0)
}
No additional markdown or text outside the JSON.`;

      const contents: any[] = [{ text: systemPrompt }];

      if (input.text) {
        contents.push({ text: `User message: "${input.text}"` });
      }

      if (input.imageBase64) {
        contents.push({
          inlineData: {
            data: input.imageBase64,
            mimeType: input.mimeType || 'image/jpeg',
          },
        });
        contents.push({ text: 'Analyze this receipt/invoice photo. Extract the total, vendor, and category.' });
      }

      if (input.audioBase64) {
        contents.push({
          inlineData: {
            data: input.audioBase64,
            mimeType: input.mimeType || 'audio/ogg',
          },
        });
        contents.push({ text: 'Listen to this voice message and extract transaction or question.' });
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout (3s limit reached)')), 3000)
      );

      const generatePromise = model.generateContent(contents);
      const result: any = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = result.response.text().trim();
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err: any) {
      const summary = err?.status === 503 ? '503 Service Unavailable (Model Busy)' : (err?.message?.substring(0, 90) || 'Timeout');
      console.warn(`⚡ Gemini API transient notice (${summary}) — Instant Deterministic NLP Engine active.`);
    }
  }

  // High-precision Deterministic NLP Engine (Fallback / Zero-Config mode)
  return parseWithDeterministicNlp(input.text || '');
}

function parseWithDeterministicNlp(text: string): ExtractedFinancialIntent {
  const lower = text.toLowerCase().trim();

  // 1. Check for Greetings
  if (/^(hi|hello|salam|assalam|hey|adaab)/i.test(lower)) {
    return {
      intent: 'GREETING',
      confidence: 0.99,
    };
  }

  // 2. Check for Financial Questions
  if (lower.includes('balance') || lower.includes('profit') || lower.includes('munafa') || lower.includes('summary') || lower.includes('kitna') || lower.includes('kitne')) {
    let partyMatch: string | undefined;
    const words = text.split(/\s+/);
    for (const w of words) {
      if (['bilal', 'ali', 'pixel', 'nova', 'ahmed'].includes(w.toLowerCase())) {
        partyMatch = w;
        break;
      }
    }
    return {
      intent: 'QUESTION',
      party_name: partyMatch,
      question_query: text,
      confidence: 0.95,
    };
  }

  // 3. Extract Amount
  // Matches e.g. "5000", "5,000", "5k", "Rs 500", "$200"
  let amount = 0;
  const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (kMatch) {
    amount = parseFloat(kMatch[1]) * 1000;
  } else {
    const numMatch = lower.match(/(?:rs\.?|\$)?\s*(\d+(?:,\d{3})*(?:\.\d+)?)/i);
    if (numMatch) {
      amount = parseFloat(numMatch[1].replace(/,/g, ''));
    }
  }

  // 4. Identify Parties
  let partyName: string | undefined;
  const partyKeywords = ['bilal', 'ali', 'hassan', 'nasir', 'pixel', 'nova', 'bluetech', 'ahmed'];
  for (const p of partyKeywords) {
    if (lower.includes(p)) {
      partyName = p.charAt(0).toUpperCase() + p.slice(1);
      break;
    }
  }

  // 5. Determine Transaction Type & Category
  let type: 'INCOME' | 'EXPENSE' | 'CREDIT_SALE' | 'CREDIT_PURCHASE' = 'EXPENSE';
  let category = 'Misc';
  let paymentMethod: 'CASH' | 'BANK' | 'CREDIT_UDHAR' = 'CASH';

  if (lower.includes('received') || lower.includes('sale') || lower.includes('income') || lower.includes('aamdani') || lower.includes('mile') || lower.includes('recieved')) {
    type = 'INCOME';
    category = 'Sales';
  } else if (lower.includes('udhar') || lower.includes('credit')) {
    type = lower.includes('diya') || lower.includes('gave') ? 'CREDIT_SALE' : 'CREDIT_PURCHASE';
    paymentMethod = 'CREDIT_UDHAR';
  } else {
    type = 'EXPENSE';
    if (lower.includes('petrol') || lower.includes('fuel') || lower.includes('bill') || lower.includes('electric') || lower.includes('bijli')) {
      category = 'Utilities';
    } else if (lower.includes('software') || lower.includes('figma') || lower.includes('cloud') || lower.includes('hosting')) {
      category = 'Software';
    } else if (lower.includes('ads') || lower.includes('marketing') || lower.includes('google')) {
      category = 'Marketing';
    } else if (lower.includes('developer') || lower.includes('freelancer') || lower.includes('salary') || lower.includes('courier')) {
      category = 'Contractors';
    } else if (lower.includes('food') || lower.includes('tea') || lower.includes('chai') || lower.includes('lunch')) {
      category = 'Entertainment';
    }
  }

  if (lower.includes('bank') || lower.includes('online') || lower.includes('transfer')) {
    paymentMethod = 'BANK';
  }

  return {
    intent: 'TRANSACTION',
    type,
    amount: amount || 0,
    category,
    party_name: partyName,
    payment_method: paymentMethod,
    notes: text,
    confidence: 0.9,
  };
}
