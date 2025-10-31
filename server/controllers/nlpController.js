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
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use widely supported latest alias
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

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
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || '';
    return res.json({ answer: text });
  } catch (err) {
    console.error('askQuestion error:', err?.message);
    return res.status(500).json({ error: 'Failed to answer' });
  }
}


