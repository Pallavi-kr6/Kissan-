import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000
});

export async function fetchWeather({ lat, lon, q, units = 'metric' } = {}) {
  const params = {};
  if (lat && lon) { params.lat = lat; params.lon = lon; }
  if (q) params.q = q;
  params.units = units;
  const res = await api.get('/weather', { params });
  return res.data;
}


