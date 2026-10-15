import express from 'express';
import {
  getAiStatus,
  verifyGeminiKey,
  analyzePassage,
  respondToQuery,
  generateRewrite,
} from '../controllers/aiController.js';

const router = express.Router();

router.get('/status', getAiStatus);
router.post('/verify-key', verifyGeminiKey);
router.post('/analyze', analyzePassage);
router.post('/query', respondToQuery);
router.post('/rewrite', generateRewrite);

export default router;
