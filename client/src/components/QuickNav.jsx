import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';

export default function QuickNav({ className = '' }) {
  const { t } = useI18n();
  const base = 'px-5 py-2.5 rounded-lg font-medium transition';
  return (
    <div className={`flex gap-3 flex-wrap ${className}`}>
      <NavLink to="/" className={`bg-white/10 text-white border border-white/20 hover:bg-white/15 ${base}`}>{t('nav_home')}</NavLink>
      <NavLink to="/subsidy" className={`bg-white text-emerald-700 hover:bg-emerald-50 ${base}`}>{t('nav_subsidy')}</NavLink>
      <NavLink to="/schemes" className={`bg-white/10 text-white border border-white/20 hover:bg-white/15 ${base}`}>{t('nav_schemes')}</NavLink>
      <NavLink to="/disease" className={`bg-white/10 text-white border border-white/20 hover:bg-white/15 ${base}`}>{t('nav_disease')}</NavLink>
    </div>
  );
}


