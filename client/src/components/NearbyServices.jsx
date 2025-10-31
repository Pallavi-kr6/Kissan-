import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useI18n } from '../i18n.jsx';

export default function NearbyServices() {
  const { t } = useI18n();
  const [center, setCenter] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(null);

  const libs = useMemo(() => ['places'], []);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '', libraries: libs });

  async function fetchNearby({ lat, lng }) {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const url = new URL(`${base}/nearby`);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lng', String(lng));
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch nearby');
    return res.json();
  }

  async function onClick() {
    try {
      setError('');
      setLoading(true);
      if (!('geolocation' in navigator)) throw new Error('Geolocation not supported');
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude; const lng = pos.coords.longitude;
        setCenter({ lat, lng });
        try {
          const data = await fetchNearby({ lat, lng });
          setItems(Array.isArray(data?.items) ? data.items : []);
        } catch (e) {
          setError(t('nearby_error_load'));
        } finally {
          setLoading(false);
        }
      }, (err) => {
        setError(t('nearby_error_permission'));
        setLoading(false);
      }, { enableHighAccuracy: false, timeout: 8000 });
    } catch (e) {
      setError(t('nearby_error_location'));
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{t('nearby_title')}</div>
        <button onClick={onClick} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition shadow-sm">{t('nearby_button')}</button>
      </div>
      {loading && <div className="text-gray-600 text-sm">{t('nearby_locating')}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {center && isLoaded && (
        <div className="h-64 w-full rounded-xl overflow-hidden border">
          <GoogleMap zoom={12} center={center} mapContainerStyle={{ height: '100%', width: '100%' }}>
            <Marker position={center} />
            {items.map((it, idx) => (
              <Marker key={idx} position={{ lat: it.geometry?.location?.lat, lng: it.geometry?.location?.lng }} onClick={() => setActive(idx)} />
            ))}
            {active != null && items[active] && (
              <InfoWindow position={{ lat: items[active].geometry.location.lat, lng: items[active].geometry.location.lng }} onCloseClick={() => setActive(null)}>
                <div className="text-sm">
                  <div className="font-medium">{items[active].name}</div>
                  <div className="text-gray-600">{items[active].vicinity}</div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, idx) => (
          <div key={idx} className="rounded-xl border border-gray-100 p-4 bg-gray-50">
            <div className="font-semibold">{it.name}</div>
            <div className="text-sm text-gray-700">{it.vicinity}</div>
            <div className="text-xs text-gray-500 mt-1">⭐ {it.rating || 'N/A'} ({it.user_ratings_total || 0})</div>
          </div>
        ))}
      </div>
    </div>
  );
}


