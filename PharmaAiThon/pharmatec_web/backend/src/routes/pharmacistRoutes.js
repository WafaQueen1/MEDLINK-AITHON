import { Router } from 'express';
import {
  addMedicine,
  editMedicine,
  editPharmacyProfile,
  getPharmacyDashboard,
  listMedicines,
  removeMedicine,
  listPrescriptions,
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

export default router;
