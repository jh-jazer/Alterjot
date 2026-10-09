import { Router } from 'express';
import {
  getChapters,
  createChapter,
  updateChapter,
  reorderChapters,
  deleteChapter,
} from '../controllers/chapterController.js';

const router = Router();

router.get('/', getChapters);
router.post('/', createChapter);
router.post('/reorder', reorderChapters);
router.patch('/:id', updateChapter);
router.delete('/:id', deleteChapter);

export default router;
