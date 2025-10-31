export default function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Welcome to Kissan+</h2>
      <p className="text-gray-700">A simple assistant for farmers to find subsidies, latest schemes, and detect crop diseases.</p>
      <ul className="list-disc list-inside text-gray-700">
        <li>Check region-wise subsidy and mandi prices</li>
        <li>Browse latest government schemes</li>
        <li>Detect plant diseases from leaf images</li>
      </ul>
    </div>
  );
}


