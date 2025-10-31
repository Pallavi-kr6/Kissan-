import axios from 'axios';
import { buildDataGovUrl } from '../utils/apiHelpers.js';

export async function getSubsidyPrices(req, res) {
  try {
    const state = (req.query.state || '').trim();
    const commodity = (req.query.commodity || '').trim();

    if (!state || !commodity) {
      return res.status(400).json({ error: 'Missing required query params: state, commodity' });
    }

    const apiKey = process.env.DATA_GOV_IN_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'DATA_GOV_IN_API_KEY not configured' });
    }

    const url = buildDataGovUrl({ apiKey, state, commodity });
    const { data } = await axios.get(url, { timeout: 15000 });

    const records = Array.isArray(data?.records) ? data.records : [];
    return res.json({ count: records.length, records });
  } catch (err) {
    console.error('Error fetching subsidy prices:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch subsidy/prices data' });
  }
}


