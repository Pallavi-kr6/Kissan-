export default function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-2 text-gray-600">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></span>
      <span>{label}</span>
    </div>
  );
}


