import { Router } from 'express';
import { createPromotion, getMyPromotions, getActivePromotions } from '../controllers/promotionController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

// Patient/Public routes to get active promotions
router.get('/active', getActivePromotions);

// Pharmacist routes for managing promotions
router.post('/', protect, authorizeRoles('pharmacist'), createPromotion);
router.get('/my', protect, authorizeRoles('pharmacist'), getMyPromotions);

export default router;
