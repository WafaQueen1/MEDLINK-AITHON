import { Router } from 'express';
import {
  createPatient,
  createPrescription,
  getDoctorDashboard,
  listPatients,
  listPrescriptions,
} from '../controllers/doctorController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorizeRoles('doctor'));

router.get('/dashboard', getDoctorDashboard);
router.get('/patients', listPatients);
router.post('/patients', createPatient);
router.get('/prescriptions', listPrescriptions);
router.post('/prescriptions', createPrescription);

export default router;
