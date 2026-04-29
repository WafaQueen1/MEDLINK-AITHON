import { Router } from 'express';
import aiService from '../services/aiService.js';

const router = Router();

// Get shortage heatmap data
router.get('/heatmap', async (req, res) => {
  try {
    const data = await aiService.predictShortages();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get restock requests (mock)
router.get('/orders', async (req, res) => {
  res.json([
    { id: 1, pharmacyName: 'Pharmacie Centrale', items: ['Doliprane 1g', 'Clamoxyl'], status: 'urgent' },
    { id: 2, pharmacyName: 'Pharmacie El Hana', items: ['Lovenox'], status: 'normal' }
  ]);
});

export default router;
