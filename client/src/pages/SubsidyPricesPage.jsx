import { useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'
];

export default function SubsidyPricesPage() {
  const [state, setState] = useState('Maharashtra');
  const [commodity, setCommodity] = useState('Tomato');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  async function handleFetch() {
    setLoading(true);
    setError('');
    setRecords([]);
    try {
      const res = await api.get('/subsidy', { params: { state, commodity } });
      setRecords(res.data.records || []);
    } catch (e) {
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Subsidy & Prices</h2>
      <div className="bg-white p-4 rounded-lg shadow border grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Select State</label>
          <select className="w-full border rounded px-3 py-2" value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Enter Crop Name</label>
          <input className="w-full border rounded px-3 py-2" value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder="e.g. Tomato" />
        </div>
        <div className="flex items-end">
          <button onClick={handleFetch} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full">Fetch Subsidy Prices</button>
        </div>
      </div>

      {loading && <Loader label="Fetching data..." />}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        {records.map((r, idx) => (
          <Card key={idx} title={`${r.commodity} - ${r.market || r.market_center || 'Market'}`} footer={`State: ${r.state} | Variety: ${r.variety || 'NA'}`}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-600">Modal Price:</span> <span className="font-semibold">{r.modal_price}</span></div>
              <div><span className="text-gray-600">Min Price:</span> <span className="font-semibold">{r.min_price}</span></div>
              <div><span className="text-gray-600">Max Price:</span> <span className="font-semibold">{r.max_price}</span></div>
              <div><span className="text-gray-600">Arrival Date:</span> <span className="font-semibold">{r.arrival_date}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


