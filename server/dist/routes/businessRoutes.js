import { Router } from 'express';
import { getBusinessProfile, updateBusinessProfile, getDemoPersonas, switchPersona, } from '../controllers/businessController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', protectRoute, getBusinessProfile);
router.put('/', protectRoute, updateBusinessProfile);
router.get('/personas', getDemoPersonas);
router.post('/switch-persona', switchPersona);
export default router;
