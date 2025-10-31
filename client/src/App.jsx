import { Routes, Route, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SubsidyPricesPage from './pages/SubsidyPricesPage.jsx';
import LatestSchemesPage from './pages/LatestSchemesPage.jsx';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-semibold text-xl">Kissan+</h1>
          <nav className="flex gap-4">
            <NavLink to="/" className={({isActive}) => isActive ? 'underline' : ''}>Home</NavLink>
            <NavLink to="/subsidy" className={({isActive}) => isActive ? 'underline' : ''}>Subsidy</NavLink>
            <NavLink to="/schemes" className={({isActive}) => isActive ? 'underline' : ''}>Schemes</NavLink>
            <NavLink to="/disease" className={({isActive}) => isActive ? 'underline' : ''}>Disease</NavLink>
          </nav>
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


