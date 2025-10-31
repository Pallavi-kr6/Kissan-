import { Router } from 'express';
import { getLatestSchemes } from '../controllers/schemeController.js';

const router = Router();

// GET /api/schemes
router.get('/', getLatestSchemes);

export default router;


