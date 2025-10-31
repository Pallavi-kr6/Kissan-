import { useI18n } from '../i18n.jsx';

export default function Card({ title, children, footer, badge, href }) {
  const { t } = useI18n();
  return (
    <div className="relative group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-green-50 via-transparent to-emerald-50" />
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          {title && <h3 className="text-xl font-semibold tracking-tight text-gray-900">{title}</h3>}
          {badge && (
            <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          )}
        </div>
        <div className="mt-3 text-gray-700 leading-relaxed">
          {children}
        </div>
        {(footer || href) && (
          <div className="mt-4 flex items-center justify-between">
            {footer && <div className="text-sm text-gray-500">{footer}</div>}
            {href && (
              <a
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-medium"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {t('learn_more')}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5 10a.75.75 0 0 1 .75-.75h6.638L9.23 6.386a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.158-3.158H5.75A.75.75 0 0 1 5 10Z" clipRule="evenodd" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


