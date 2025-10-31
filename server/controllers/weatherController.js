import axios from 'axios';

export async function getCurrentWeather(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OPENWEATHER_API_KEY not configured' });

    const { lat, lon, q, units = 'metric' } = req.query;
    const params = new URLSearchParams({ appid: apiKey, units });
    if (lat && lon) {
      params.set('lat', lat);
      params.set('lon', lon);
    } else if (q) {
      params.set('q', q);
    } else {
      params.set('q', 'Mumbai,IN');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;
    const { data } = await axios.get(url, { timeout: 12000 });

    return res.json({
      name: data?.name,
      country: data?.sys?.country,
      temp: data?.main?.temp,
      feels_like: data?.main?.feels_like,
      humidity: data?.main?.humidity,
      wind: data?.wind?.speed,
      condition: data?.weather?.[0]?.main,
      description: data?.weather?.[0]?.description,
      icon: data?.weather?.[0]?.icon,
    });
  } catch (err) {
    console.error('getCurrentWeather error:', err?.message);
    return res.status(500).json({ error: 'Failed to fetch weather' });
  }
}


