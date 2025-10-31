import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemesPath = path.resolve(__dirname, '../data/schemes.json');

let cachedSchemes = null;
async function loadSchemes() {
  if (cachedSchemes) return cachedSchemes;
  const fileContents = await readFile(schemesPath, 'utf-8');
  cachedSchemes = JSON.parse(fileContents);
  return cachedSchemes;
}

function langToTranslationKey(lang) {
  const map = {
    'en': 'english',
    'hi': 'hindi',
    'mr': 'marathi',
    'ta': 'tamil'
  };
  return map[lang] || 'english';
}

export async function getLatestSchemes(req, res) {
  try {
    const schemes = await loadSchemes();
    const lang = (req.query?.lang || 'en').trim();
    const transKey = langToTranslationKey(lang);

    const mapped = schemes.map(scheme => {
      const translation = scheme.translations?.[transKey] || scheme.translations?.english || '';
      return {
        short_name: scheme.short_name,
        name: scheme.short_name,
        description: translation,
        ministry: '', // Add if needed in future
        benefits: '',
        eligibility: '',
        more_info: '', // Add URLs if needed
        notes: ''
      };
    });

    return res.json({ count: mapped.length, schemes: mapped, lang, provider: 'static' });
  } catch (err) {
    console.error('Error fetching latest schemes:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch latest schemes' });
  }
}


