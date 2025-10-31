export async function getLatestSchemes(req, res) {
  try {
    // Placeholder implementation; replace with real data source as needed
    return res.json({ count: 0, schemes: [] });
  } catch (err) {
    console.error('Error fetching latest schemes:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch latest schemes' });
  }
}


