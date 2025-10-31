import { useI18n } from '../i18n.jsx';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWeather } from '../services/api.js';

export default function HomePage() {
  const { t } = useI18n();
  const [weather, setWeather] = useState(null);
  const [wErr, setWErr] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setWErr('');
        // Try geolocation, fallback to city
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            if (cancelled) return;
            try {
              const data = await fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
              if (!cancelled) setWeather(data);
            } catch (e) {
              const data = await fetchWeather({ q: 'Mumbai,IN' });
              if (!cancelled) setWeather(data);
            }
          }, async () => {
            const data = await fetchWeather({ q: 'Mumbai,IN' });
            if (!cancelled) setWeather(data);
          }, { enableHighAccuracy: false, timeout: 5000 });
        } else {
          const data = await fetchWeather({ q: 'Mumbai,IN' });
          if (!cancelled) setWeather(data);
        }
      } catch (e) {
        setWErr('');
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white p-8 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home_title')}</h2>
        <p className="mt-2 text-emerald-50 max-w-2xl">{t('home_sub')}</p>
        <div className="mt-6 flex gap-3 flex-wrap">
          <NavLink to="/subsidy" className="px-5 py-2.5 rounded-lg bg-white text-emerald-700 font-medium hover:bg-emerald-50">{t('nav_subsidy')}</NavLink>
          <NavLink to="/schemes" className="px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium border border-white/20 hover:bg-white/15">{t('nav_schemes')}</NavLink>
          <NavLink to="/disease" className="px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium border border-white/20 hover:bg-white/15">{t('nav_disease')}</NavLink>
        </div>
      </section>

      {weather && (
        <section>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                {/* Simple animated icon: spinning sun with pulsing rays */}
                <div className="absolute inset-0 rounded-full bg-yellow-300 animate-pulse"></div>
                <div className="absolute inset-1 rounded-full bg-yellow-400 animate-spin [animation-duration:4s]"></div>
              </div>
              <div>
                <div className="text-lg font-semibold">{weather.name}, {weather.country}</div>
                <div className="text-sm text-gray-600 capitalize">{weather.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(weather.temp)}°C</div>
              <div className="text-xs text-gray-500">Feels {Math.round(weather.feels_like)}°C • Humidity {weather.humidity}% • Wind {weather.wind} m/s</div>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_subsidy')}</div>
            <p className="text-sm text-gray-600">{t('home_b1')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_schemes')}</div>
            <p className="text-sm text-gray-600">{t('home_b2')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_disease')}</div>
            <p className="text-sm text-gray-600">{t('home_b3')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}


