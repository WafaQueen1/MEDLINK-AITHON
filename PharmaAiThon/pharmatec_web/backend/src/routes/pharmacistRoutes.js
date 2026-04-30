import { Router } from 'express';
import {
  addMedicine,
  editMedicine,
  editPharmacyProfile,
  getPharmacyDashboard,
  listMedicines,
  removeMedicine,
  listPrescriptions,
  verifyChifa,
  createOrder,
  getRequests
} from '../controllers/pharmacistController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorizeRoles('pharmacist'));

router.get('/dashboard', getPharmacyDashboard);
router.put('/profile', editPharmacyProfile);
router.get('/medicines', listMedicines);
router.post('/medicines', addMedicine);
router.put('/medicines/:medicineId', editMedicine);
router.delete('/medicines/:medicineId', removeMedicine);
router.get('/prescriptions', listPrescriptions);
router.get('/requests', getRequests);

router.post('/verify-chifa/:request_id', verifyChifa);
router.post('/request-stock', createOrder);

export default router;
