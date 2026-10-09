import { Router } from 'express';
import {
  getScenes,
  getSceneById,
  createScene,
  updateScene,
  reorderScenes,
  deleteScene,
} from '../controllers/sceneController.js';

const router = Router();

router.get('/', getScenes);
router.post('/', createScene);
router.post('/reorder', reorderScenes);
router.get('/:id', getSceneById);
router.patch('/:id', updateScene);
router.delete('/:id', deleteScene);

export default router;
