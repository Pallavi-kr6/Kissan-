import { useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { useI18n } from '../i18n.jsx';

export default function DiseaseDetectionPage() {
  const { t } = useI18n();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult(null);
    setError('');
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview('');
    }
  }

  async function handleDetect() {
    if (!file) {
      setError(t('disease_err_upload'));
      return;
    }
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.post('/disease', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data.result || null);
    } catch (e) {
      setError(t('disease_err_fail'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('disease_title')}</h2>
      <div className="bg-white p-4 rounded-lg shadow border grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-700 mb-1">{t('disease_upload_label')}</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {preview && (
            <img src={preview} alt="preview" className="mt-3 rounded border max-h-64 object-contain" />
          )}
        </div>
        <div className="flex items-end">
          <button onClick={handleDetect} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full">{t('disease_cta')}</button>
        </div>
      </div>

      {loading && <Loader label={t('disease_analyzing')} />}
      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <Card title={t('disease_result_title')}>
          <p><span className="font-semibold">{t('disease_result_disease')}</span> {result.disease}</p>
          <p className="mt-1"><span className="font-semibold">{t('disease_result_suggestion')}</span> {result.suggestion}</p>
        </Card>
      )}
    </div>
  );
}


