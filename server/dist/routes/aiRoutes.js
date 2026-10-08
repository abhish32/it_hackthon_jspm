import { Router } from 'express';
import { handleAiChat, handleConvertProfile, handleGeneratePitch } from '../controllers/aiController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/chat', protectRoute, handleAiChat);
router.post('/convert-profile', protectRoute, handleConvertProfile);
router.post('/generate-pitch', protectRoute, handleGeneratePitch);
export default router;
