export const env = {
  port: process.env.PORT || '5000',
  dataGovApiKey: process.env.DATA_GOV_IN_API_KEY || '',
  pibRssUrl: process.env.PIB_RSS_URL || 'https://pib.gov.in/Rss.aspx?ModID=6&MinID=30',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY || ''
};


