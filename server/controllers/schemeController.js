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

export async function getLatestSchemes(req, res) {
  try {
    const schemes = await loadSchemes();
    return res.json({ count: schemes.length, schemes });
  } catch (err) {
    console.error('Error fetching latest schemes:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch latest schemes' });
  }
}


