import { Router } from 'express';
import authRoutes from './authRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import pharmacistRoutes from './pharmacistRoutes.js';
import supplierRoutes from './supplierRoutes.js';
import adminRoutes from './adminRoutes.js';
import publicRoutes from './publicRoutes.js';
import { healthCheck } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/pharmacist', pharmacistRoutes);
router.use('/supplier', supplierRoutes);
router.use('/admin', adminRoutes);
router.use('/public', publicRoutes);

export default router;
