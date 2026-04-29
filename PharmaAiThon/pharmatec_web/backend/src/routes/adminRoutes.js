import { Router } from 'express';

const router = Router();

// Get pending verifications for doctors and pharmacies
router.get('/pending-verifications', (req, res) => {
  res.json([
    { id: 101, name: 'Dr. Samir Benali', type: 'doctor', license: 'DOC-998822', status: 'pending' },
    { id: 202, name: 'Pharmacie Ibn Sina', type: 'pharmacy', license: 'PH-445566', status: 'pending' }
  ]);
});

// Approve a license
router.post('/approve/:id', (req, res) => {
  res.json({ message: `License ${req.params.id} approved successfully.` });
});

export default router;
