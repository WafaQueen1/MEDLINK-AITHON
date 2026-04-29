import { Router } from 'express';
import { getPharmaciesWithMedicines, searchMedicinesInPharmacies } from '../controllers/publicController.js';

const router = Router();

// Public routes - no authentication required
router.get('/pharmacies', getPharmaciesWithMedicines);
router.post('/pharmacies/search', searchMedicinesInPharmacies);

export default router;
