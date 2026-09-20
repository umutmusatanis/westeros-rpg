import { Router } from 'express';
import {
  createCharacter,
  getCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} from '../controllers/character.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All character routes require authentication
router.use(authenticate);

router.post('/', createCharacter);
router.get('/', getCharacters);
router.get('/:id', getCharacterById);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
