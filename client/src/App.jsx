import { Routes, Route, NavLink } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import HomePage from './pages/HomePage.jsx';
import SubsidyPricesPage from './pages/SubsidyPricesPage.jsx';
import LatestSchemesPage from './pages/LatestSchemesPage.jsx';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage.jsx';

function AppShell() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="font-semibold text-xl">{t('app_title')}</h1>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex gap-4">
              <NavLink to="/" className={({isActive}) => isActive ? 'underline' : ''}>{t('nav_home')}</NavLink>
              <NavLink to="/subsidy" className={({isActive}) => isActive ? 'underline' : ''}>{t('nav_subsidy')}</NavLink>
              <NavLink to="/schemes" className={({isActive}) => isActive ? 'underline' : ''}>{t('nav_schemes')}</NavLink>
              <NavLink to="/disease" className={({isActive}) => isActive ? 'underline' : ''}>{t('nav_disease')}</NavLink>
            </nav>
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


