import { Router } from 'express';
import { askQuestion } from '../controllers/nlpController.js';

const router = Router();
router.post('/', askQuestion);
export default router;


