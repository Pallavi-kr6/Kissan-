export default function Card({ title, children, footer }) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      <div>{children}</div>
      {footer && <div className="mt-3 text-sm text-gray-600">{footer}</div>}
    </div>
  );
}


