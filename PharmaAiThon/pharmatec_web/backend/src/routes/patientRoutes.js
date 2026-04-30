import express from 'express';
import { findBestPharmacies, sendRequest, getRequestStatus, getMyPrescriptions } from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my-prescriptions', getMyPrescriptions);
router.post('/find-pharmacy/:prescription_id', findBestPharmacies);
router.post('/send-request', sendRequest);
router.get('/request-status/:request_id', getRequestStatus);

export default router;
