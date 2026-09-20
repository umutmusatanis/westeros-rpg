import { Router } from 'express';
import {
  getHouses,
  getRegions,
  getProfessions,
  getTraits,
} from '../controllers/gameData.controller';

const router = Router();

// Public game data routes (no authentication needed)
router.get('/houses', getHouses);
router.get('/regions', getRegions);
router.get('/professions', getProfessions);
router.get('/traits', getTraits);

export default router;
