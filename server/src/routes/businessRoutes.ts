import { Router } from 'express';
import {
  getBusinessProfile,
  updateBusinessProfile,
  getDemoPersonas,
  switchPersona,
} from '../controllers/businessController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protectRoute as any, getBusinessProfile);
router.put('/', protectRoute as any, updateBusinessProfile);
router.get('/personas', getDemoPersonas);
router.post('/switch-persona', switchPersona);

export default router;
