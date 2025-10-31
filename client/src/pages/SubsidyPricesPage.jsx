import { useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { useI18n } from '../i18n.jsx';
import { api } from '../services/api.js';

const STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'
];

export default function SubsidyPricesPage() {
  const { t } = useI18n();
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
      setError(t('subsidy_error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{t('subsidy_title')}</h2>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t('subsidy_label_state')}</label>
          <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={state} onChange={(e) => setState(e.target.value)}>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t('subsidy_label_commodity')}</label>
          <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder={t('subsidy_placeholder_commodity')} />
        </div>
        <div className="flex items-end">
          <button onClick={handleFetch} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg w-full transition shadow-sm">{t('subsidy_cta')}</button>
        </div>
      </div>

      {loading && <Loader label={t('subsidy_fetching')} />}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid md:grid-cols-2 gap-5">
        {records.map((r, idx) => (
          <Card key={idx} title={`${r.commodity} - ${r.market || r.market_center || 'Market'}`} footer={`${t('subsidy_state')} ${r.state} | ${t('subsidy_variety')} ${r.variety || 'NA'}`}>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-600">{t('subsidy_modal_price')}</span> <span className="font-semibold">{r.modal_price}</span></div>
              <div><span className="text-gray-600">{t('subsidy_min_price')}</span> <span className="font-semibold">{r.min_price}</span></div>
              <div><span className="text-gray-600">{t('subsidy_max_price')}</span> <span className="font-semibold">{r.max_price}</span></div>
              <div><span className="text-gray-600">{t('subsidy_arrival_date')}</span> <span className="font-semibold">{r.arrival_date}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}


