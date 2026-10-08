import { Router } from 'express';
import { getOpportunities, getOpportunityById, expressInterest } from '../controllers/opportunityController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protectRoute as any, getOpportunities);
router.get('/:id', protectRoute as any, getOpportunityById);
router.post('/express-interest', protectRoute as any, expressInterest);

export default router;
