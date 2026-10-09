import { Router } from 'express';
import {
  getNovels,
  getNovelById,
  createNovel,
  updateNovel,
  deleteNovel,
  exportManuscript,
} from '../controllers/novelController.js';

const router = Router();

router.get('/', getNovels);
router.post('/', createNovel);
router.get('/:id', getNovelById);
router.patch('/:id', updateNovel);
router.delete('/:id', deleteNovel);
router.get('/:id/export', exportManuscript);

export default router;
