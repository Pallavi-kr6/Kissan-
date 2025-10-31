import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { useI18n } from '../i18n.jsx';
import QuickNav from '../components/QuickNav.jsx';
import { api } from '../services/api.js';

export default function LatestSchemesPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/schemes');
        // Server now returns { count, schemes }
        const data = Array.isArray(res.data?.schemes) ? res.data.schemes : (res.data?.items || []);
        setItems(data);
      } catch (e) {
        setError('Failed to fetch schemes.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white p-6 md:p-8 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('schemes_hero_title')}</h2>
        <p className="mt-2 text-emerald-50 max-w-2xl">{t('schemes_hero_sub')}</p>
        <QuickNav className="mt-4" />
      </div>

      {loading && (
        <div className="flex justify-center"><Loader /></div>
      )}
      {error && <div className="text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-lg">{error}</div>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((it, idx) => (
          <Card
            key={idx}
            title={it.name || it.title}
            footer={it.ministry || ''}
            badge={it.short_name}
            href={it.more_info || it.link}
          >
            <p className="text-sm">{it.description || it.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}


