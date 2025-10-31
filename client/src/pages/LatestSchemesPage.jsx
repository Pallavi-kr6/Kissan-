import { useEffect, useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';

export default function LatestSchemesPage() {
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Latest Government Schemes</h2>
      {loading && <Loader />}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((it, idx) => (
          <Card key={idx} title={it.name || it.title} footer={it.ministry || ''}>
            <p className="text-sm text-gray-700 mb-2">{it.description || it.summary}</p>
            {it.more_info || it.link ? (
              <a className="text-green-700 underline" href={(it.more_info || it.link)} target="_blank" rel="noreferrer">Read more</a>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}


