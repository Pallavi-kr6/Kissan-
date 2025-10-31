import { useState } from 'react';
import Card from '../components/Card.jsx';
import Loader from '../components/Loader.jsx';
import { api } from '../services/api.js';

export default function DiseaseDetectionPage() {
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
      setError('Please upload an image first.');
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
      setError('Failed to detect disease.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Disease Detection</h2>
      <div className="bg-white p-4 rounded-lg shadow border grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Upload Leaf Image</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {preview && (
            <img src={preview} alt="preview" className="mt-3 rounded border max-h-64 object-contain" />
          )}
        </div>
        <div className="flex items-end">
          <button onClick={handleDetect} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded w-full">Detect Disease</button>
        </div>
      </div>

      {loading && <Loader label="Analyzing image..." />}
      {error && <div className="text-red-600">{error}</div>}

      {result && (
        <Card title="Diagnosis Result">
          <p><span className="font-semibold">Disease:</span> {result.disease}</p>
          <p className="mt-1"><span className="font-semibold">Suggestion:</span> {result.suggestion}</p>
        </Card>
      )}
    </div>
  );
}


