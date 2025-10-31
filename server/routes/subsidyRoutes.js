import { Router } from 'express';
import { getSubsidyPrices } from '../controllers/subsidyController.js';

const router = Router();

// GET /api/subsidy?state=...&commodity=...
router.get('/', getSubsidyPrices);

export default router;


