import { Router } from 'express';
import {
  getCodex,
  getCodexById,
  createCodex,
  updateCodex,
  deleteCodex,
} from '../controllers/codexController.js';

const router = Router();

router.get('/', getCodex);
router.post('/', createCodex);
router.get('/:id', getCodexById);
router.patch('/:id', updateCodex);
router.delete('/:id', deleteCodex);

export default router;
