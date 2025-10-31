import { useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';
import { useI18n } from '../i18n.jsx';
import QuickNav from '../components/QuickNav.jsx';

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
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white p-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-bold">{t('disease_title')}</h2>
        <QuickNav className="mt-4" />
      </div>
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-700 mb-2">{t('disease_upload_label')}</label>
          <label className="flex flex-col items-center justify-center gap-2 w-full h-40 rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-400 transition cursor-pointer">
            <span className="text-sm text-gray-600">{file ? file.name : 'Drop image here or click to upload'}</span>
            <input className="hidden" type="file" accept="image/*" onChange={onFileChange} />
          </label>
          {preview && (
            <img src={preview} alt="preview" className="mt-3 rounded-xl border max-h-64 object-contain w-full bg-gray-50" />
          )}
        </div>
        <div className="flex items-end">
          <button onClick={handleDetect} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg w-full transition shadow-sm">{t('disease_cta')}</button>
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


