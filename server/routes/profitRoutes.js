import { Router } from 'express';
import { calculateProfit } from '../controllers/profitController.js';

const router = Router();
router.post('/', calculateProfit);
export default router;


