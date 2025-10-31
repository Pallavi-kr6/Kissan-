import { useI18n } from '../i18n.jsx';

export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{t('home_title')}</h2>
      <p className="text-gray-700">{t('home_sub')}</p>
      <ul className="list-disc list-inside text-gray-700">
        <li>{t('home_b1')}</li>
        <li>{t('home_b2')}</li>
        <li>{t('home_b3')}</li>
      </ul>
    </div>
  );
}


