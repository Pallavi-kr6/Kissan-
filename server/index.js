import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import subsidyRoutes from './routes/subsidyRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import askRoutes from './routes/askRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import profitRoutes from './routes/profitRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.json({ name: 'Kissan+ API', status: 'ok' });
});

app.use('/api/subsidy', subsidyRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/ask', askRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/calculateProfit', profitRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Kissan+ server listening on port ${port}`);
});


