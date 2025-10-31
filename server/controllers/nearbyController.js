import axios from 'axios';

export async function getNearby(req, res) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GOOGLE_MAPS_API_KEY not configured' });

    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({ error: 'Invalid or missing lat/lng' });
    }

    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius: '10000',
      keyword: 'mandi|fertilizer|seed|bank|agriculture',
      key: apiKey,
    });

    const { data } = await axios.get(`${url}?${params.toString()}`, { timeout: 12000 });
    const items = Array.isArray(data?.results) ? data.results.slice(0, 10).map(r => ({
      name: r.name,
      vicinity: r.vicinity,
      rating: r.rating,
      user_ratings_total: r.user_ratings_total,
      geometry: { location: r.geometry?.location }
    })) : [];
    return res.json({ count: items.length, items });
  } catch (err) {
    console.error('getNearby error:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch nearby services' });
  }
}


