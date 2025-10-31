import { Routes, Route } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import ExpertChat from './components/ExpertChat.jsx';
import HomePage from './pages/HomePage.jsx';
import SubsidyPricesPage from './pages/SubsidyPricesPage.jsx';
import LatestSchemesPage from './pages/LatestSchemesPage.jsx';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage.jsx';

function AppShell() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-gray-900">
      <header className="sticky top-0 z-30 bg-green-700/90 backdrop-blur text-white border-b border-green-600/40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="font-semibold text-xl">{t('app_title')}</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subsidy" element={<SubsidyPricesPage />} />
          <Route path="/schemes" element={<LatestSchemesPage />} />
          <Route path="/disease" element={<DiseaseDetectionPage />} />
        </Routes>
      </main>
      <ExpertChat />
      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Kissan+</span>
          <span className="text-gray-400">Built with ❤️ for farmers</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}


