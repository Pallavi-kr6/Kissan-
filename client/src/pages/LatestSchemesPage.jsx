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
        setItems(res.data.items || []);
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
          <Card key={idx} title={it.title} footer={new Date(it.pubDate).toLocaleString()}>
            <p className="text-sm text-gray-700 mb-2">{it.summary}</p>
            <a className="text-green-700 underline" href={it.link} target="_blank" rel="noreferrer">Read more</a>
          </Card>
        ))}
      </div>
    </div>
  );
}


