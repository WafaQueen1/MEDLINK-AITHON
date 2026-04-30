import { Router } from 'express';
import { getSupplierOrders, updateOrderStatus, getSupplierStats } from '../controllers/supplierController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.use(authorizeRoles('supplier'));

router.get('/orders', getSupplierOrders);
router.get('/stats', getSupplierStats);
router.patch('/orders/:id', updateOrderStatus);

export default router;
