import { Router } from 'express';
import { 
  processWeeklyTurn, 
  recruitTroops, 
  updateReputation, 
  buyEquipment,
  getEconomicSummary 
} from '../controllers/economy.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// All economy routes require authentication
router.use(authenticateToken);

// POST /api/economy/weekly-turn - Process weekly income and expenses
router.post('/weekly-turn', processWeeklyTurn);

// POST /api/economy/recruit - Recruit new troops
router.post('/recruit', recruitTroops);

// POST /api/economy/reputation - Update character reputation
router.post('/reputation', updateReputation);

// POST /api/economy/buy-equipment - Buy equipment
router.post('/buy-equipment', buyEquipment);

// GET /api/economy/summary/:characterId - Get economic summary
router.get('/summary/:characterId', getEconomicSummary);

export default router;
