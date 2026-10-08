import { Router } from 'express';
import { handleAiChat, handleConvertProfile, handleGeneratePitch } from '../controllers/aiController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/chat', protectRoute as any, handleAiChat);
router.post('/convert-profile', protectRoute as any, handleConvertProfile);
router.post('/generate-pitch', protectRoute as any, handleGeneratePitch);

export default router;
