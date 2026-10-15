import express from 'express';
import { googleSignIn, getAuthConfig, getVault, saveVault } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/google - Authenticate with Google ID Token
router.post('/google', googleSignIn);

// GET /api/auth/config - Check if Google Auth is configured
router.get('/config', getAuthConfig);

// GET & POST /api/auth/vault - End-to-End Encrypted Cloud Vault Sync
router.get('/vault', getVault);
router.post('/vault', saveVault);

export default router;

