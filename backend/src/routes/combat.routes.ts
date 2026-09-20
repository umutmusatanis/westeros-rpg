import { Router } from 'express';
import { initiateDuel, initiateBattle, practiceDuel, getCombatHistory } from '../controllers/combat.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All combat routes require authentication
router.use(authenticateToken);

// POST /api/combat/duel - Start a 1v1 duel
router.post('/duel', initiateDuel);

// POST /api/combat/battle - Start an army battle
router.post('/battle', initiateBattle);

// POST /api/combat/practice - Practice duel (no consequences)
router.post('/practice', practiceDuel);

// GET /api/combat/history/:characterId - Get combat history
router.get('/history/:characterId', getCombatHistory);

export default router;
