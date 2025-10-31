import { useI18n } from '../i18n.jsx';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWeather } from '../services/api.js';
import QuickNav from '../components/QuickNav.jsx';
import NearbyServices from '../components/NearbyServices.jsx';

export default function HomePage() {
  const { t } = useI18n();
  const [weather, setWeather] = useState(null);
  const [wErr, setWErr] = useState('');
  const [calc, setCalc] = useState({
    landSize: '',
    fertilizerCostPerAcre: '',
    seedCostPerAcre: '',
    labourCostPerAcre: '',
    sellingPricePerQuintal: '',
    yieldPerAcre: '',
  });
  const [result, setResult] = useState(null);
  const [calcErr, setCalcErr] = useState('');
  
  // Handlers (must be inside component to access state)
  const handleReset = () => {
    setCalc({
      landSize: '',
      fertilizerCostPerAcre: '',
      seedCostPerAcre: '',
      labourCostPerAcre: '',
      sellingPricePerQuintal: '',
      yieldPerAcre: '',
    });
    setResult(null);
    setCalcErr('');
  };

  const handleCalculate = async (e) => {
    e?.preventDefault?.();
    setCalcErr('');
    try {
      const payload = {
        landSize: Number(calc.landSize || 0),
        fertilizerCostPerAcre: Number(calc.fertilizerCostPerAcre || 0),
        seedCostPerAcre: Number(calc.seedCostPerAcre || 0),
        labourCostPerAcre: Number(calc.labourCostPerAcre || 0),
        sellingPricePerQuintal: Number(calc.sellingPricePerQuintal || 0),
        yieldPerAcre: Number(calc.yieldPerAcre || 0),
      };
      const data = await postCalculate(payload);
      setResult(data);
    } catch (err) {
      setCalcErr(t('calc_error'));
    }
  };

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
        <QuickNav className="mt-6" />
      </section>

      {/* Nearby Services */}
      <section>
        <NearbyServices />
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

      {/* Profit & Cost Calculator */}
      <section>
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4">
          <div className="text-xl font-semibold">{t('calc_title')}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_land_size')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.landSize} onChange={e=>setCalc(v=>({...v, landSize:e.target.value}))} inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_fertilizer_cost')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.fertilizerCostPerAcre} onChange={e=>setCalc(v=>({...v, fertilizerCostPerAcre:e.target.value}))} inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_seed_cost')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.seedCostPerAcre} onChange={e=>setCalc(v=>({...v, seedCostPerAcre:e.target.value}))} inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_labour_cost')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.labourCostPerAcre} onChange={e=>setCalc(v=>({...v, labourCostPerAcre:e.target.value}))} inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_selling_price')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.sellingPricePerQuintal} onChange={e=>setCalc(v=>({...v, sellingPricePerQuintal:e.target.value}))} inputMode="decimal" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">{t('calc_yield')}</label>
              <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={calc.yieldPerAcre} onChange={e=>setCalc(v=>({...v, yieldPerAcre:e.target.value}))} inputMode="decimal" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={(e)=>handleCalculate(e)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition shadow-sm">{t('calc_button')}</button>
            <button onClick={handleReset} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition">{t('calc_reset')}</button>
          </div>
          {calcErr && <div className="text-red-600 text-sm">{calcErr}</div>}
          {result && (
            <div className="grid sm:grid-cols-3 gap-4">
              <CalcStat title={t('calc_total_cost')} value={formatInr(result.totals.cost)} />
              <CalcStat title={t('calc_total_revenue')} value={formatInr(result.totals.revenue)} />
              <CalcStat title={t('calc_net_profit')} value={formatInr(result.totals.profit)} />
              <div className="sm:col-span-3 text-sm mt-1">
                {result.perAcre.profit >= 0 ? (
                  <span className="text-emerald-700">✅ {t('calc_profit_msg').replace('{amount}', formatInr(result.perAcre.profit))}</span>
                ) : (
                  <span className="text-amber-700">⚠️ {t('calc_loss_msg').replace('{amount}', formatInr(Math.abs(result.perAcre.profit)))}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <section>
      <h1>What Kissan+ Can Do For You</h1>
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

function CalcStat({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4 bg-gray-50">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function formatInr(n) {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Number(n || 0));
  } catch {
    return `₹${Number(n || 0).toFixed(2)}`;
  }
}

async function postCalculate(body) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const res = await fetch(`${base}/calculateProfit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}




