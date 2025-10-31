export function buildDataGovUrl({ apiKey, state, commodity, limit = 10, offset = 0 }) {
  // Official Agmarknet dataset ID for daily commodity prices
  const base = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

  const params = new URLSearchParams({
    'api-key': apiKey,
    format: 'json',           // Can be json / xml / csv
    offset: offset.toString(),
    limit: limit.toString(),
  });

  // Add filters dynamically if provided
  if (state) params.append('filters[state.keyword]', state);
  if (commodity) params.append('filters[commodity]', commodity);

  // Construct and return full URL
  return `${base}?${params.toString()}`;
}
