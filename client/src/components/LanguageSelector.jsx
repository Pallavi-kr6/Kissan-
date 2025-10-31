import { useI18n } from '../i18n.jsx';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function LanguageSelector() {
  const { lang, setLang } = useI18n();

  return (
    <select
      className="bg-white/10 text-white border border-white/20 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language selector"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code} className="text-gray-900">
          {l.label}
        </option>
      ))}
    </select>
  );
}


