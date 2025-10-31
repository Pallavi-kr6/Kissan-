import { useI18n } from '../i18n.jsx';
import { NavLink } from 'react-router-dom';

export default function HomePage() {
  const { t } = useI18n();
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white p-8 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t('home_title')}</h2>
        <p className="mt-2 text-emerald-50 max-w-2xl">{t('home_sub')}</p>
        <div className="mt-6 flex gap-3 flex-wrap">
          <NavLink to="/subsidy" className="px-5 py-2.5 rounded-lg bg-white text-emerald-700 font-medium hover:bg-emerald-50">{t('nav_subsidy')}</NavLink>
          <NavLink to="/schemes" className="px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium border border-white/20 hover:bg-white/15">{t('nav_schemes')}</NavLink>
          <NavLink to="/disease" className="px-5 py-2.5 rounded-lg bg-white/10 text-white font-medium border border-white/20 hover:bg-white/15">{t('nav_disease')}</NavLink>
        </div>
      </section>

      <section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_subsidy')}</div>
            <p className="text-sm text-gray-600">{t('home_b1')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_schemes')}</div>
            <p className="text-sm text-gray-600">{t('home_b2')}</p>
          </div>
          <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="text-lg font-semibold mb-1">{t('nav_disease')}</div>
            <p className="text-sm text-gray-600">{t('home_b3')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}


