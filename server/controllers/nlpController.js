import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadSchemesContext() {
  try {
    const p = path.resolve(__dirname, '../data/schemes.json');
    const txt = await readFile(p, 'utf-8');
    const arr = JSON.parse(txt);
    const lines = arr.map((s, i) => `- ${s.short_name || s.name}: ${s.description} (ministry: ${s.ministry}) more: ${s.more_info}`).join('\n');
    return `Schemes:\n${lines}`;
  } catch {
    return '';
  }
}

export async function askQuestion(req, res) {
  try {
    const question = (req.body?.question || '').trim();
    const lang = (req.body?.lang || 'en').trim();
    if (!question) return res.status(400).json({ error: 'Missing question' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallback = await buildFallbackAnswer(question, lang);
      return res.status(200).json({ answer: fallback, provider: 'fallback' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Model name may require specific project access; if the call fails we'll fallback
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const schemesCtx = await loadSchemesContext();
    const appCtx = `
You are Kissan+ assistant. You can answer:
- General crop cultivation, disease, and best practices questions
- Questions about government schemes (see context)
- How to use local endpoints: /api/schemes (static list), /api/subsidy?state=..&commodity=.. (Agmarknet prices), /api/disease (image form-data 'image')
Answer briefly and helpfully. If you are not sure, say so. Reply in language code: ${lang}.
${schemesCtx}
`;

    const prompt = `${appCtx}\n\nUser: ${question}\nAssistant:`;
    try {
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.() || '';
      return res.json({ answer: text, provider: 'gemini' });
    } catch (err) {
      // Fallback if model not available or project lacks access
      const fallback = await buildFallbackAnswer(question, lang);
      return res.status(200).json({ answer: fallback, provider: 'fallback' });
    }
  } catch (err) {
    console.error('askQuestion error:', err?.message);
    return res.status(500).json({ error: 'Failed to answer' });
  }
}

async function buildFallbackAnswer(question, lang) {
  const q = question.toLowerCase();
  const schemesCtx = await loadSchemesContext();

  // Simple intent routing
  if (q.includes('scheme') || q.includes('yojana')) {
    return `${locale(lang, 'Here are some key schemes:')}
${schemesCtx}`.slice(0, 1800);
  }
  if (q.includes('price') || q.includes('mandi') || q.includes('subsidy')) {
    return locale(lang, 'You can get current mandi prices via: GET /api/subsidy?state=STATE&commodity=CROP. Example: http://localhost:5000/api/subsidy?state=Maharashtra&commodity=Tomato');
  }
  if (q.includes('disease') || q.includes('leaf') || q.includes('detect')) {
    return locale(lang, "Upload a leaf photo to POST /api/disease as form-data with key 'image'. In the app, open the Disease page and use the uploader.");
  }
  if (q.includes('weather')) {
    return locale(lang, 'Weather is shown on Home. Server endpoint: GET /api/weather?lat=..&lon=.. or ?q=City,CC (uses OpenWeather).');
  }
  // Generic agronomy tips (very high-level)
  if (q.includes('tomato')) return locale(lang, 'Tomato: use well-drained loamy soil, maintain 18–27°C, stake plants, irrigate regularly, monitor for blight and use recommended fungicides. Apply balanced NPK per local advisory.');
  if (q.includes('wheat')) return locale(lang, 'Wheat: timely sowing, certified seeds, 120–150 kg/ha seed rate (variety dependent), adequate irrigation at CRI, tillering, booting and grain filling stages. Manage rusts using resistant varieties.');
  if (q.includes('rice') || q.includes('paddy')) return locale(lang, 'Rice: puddled transplanting or DSR per region, maintain standing water during tillering, apply N in splits, monitor for BPH and blast; follow local IPM advisories.');

  return locale(lang, 'I could not use the online model. I shared built-in guidance. Ask about schemes, prices, disease, or specific crops.');
}

function locale(lang, text) {
  // Minimal localization stub; return English for now
  return text;
}


