import express from 'express';
import { googleSignIn, getAuthConfig } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/google - Authenticate with Google ID Token
router.post('/google', googleSignIn);

// GET /api/auth/config - Check if Google Auth is configured
router.get('/config', getAuthConfig);

export default router;
