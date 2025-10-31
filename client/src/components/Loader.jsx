import { useI18n } from '../i18n.jsx';

export default function Loader({ label }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></span>
      <span>{label || t('loading')}</span>
    </div>
  );
}


