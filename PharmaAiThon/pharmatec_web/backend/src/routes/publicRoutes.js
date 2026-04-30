import { Router } from 'express';
import { getPharmaciesWithMedicines, searchMedicinesInPharmacies, getSuppliers } from '../controllers/publicController.js';

const router = Router();

// Public routes - no authentication required
router.get('/pharmacies', getPharmaciesWithMedicines);
router.post('/pharmacies/search', searchMedicinesInPharmacies);
router.get('/suppliers', getSuppliers);

export default router;
