import { Router } from 'express';
import multer from 'multer';
import { detectDisease } from '../controllers/diseaseController.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/disease  (form-data: image)
router.post('/', upload.single('image'), detectDisease);

export default router;


