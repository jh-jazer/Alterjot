import express from 'express';
import { googleSignIn, getAuthConfig, getVault, saveVault, getCurrentUser, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// GET /api/auth/me - Retrieve verified author profile
router.get('/me', getCurrentUser);

// PATCH & PUT /api/auth/profile - Update author profile (e.g. penName)
router.patch('/profile', updateProfile);
router.put('/profile', updateProfile);

// POST /api/auth/google - Authenticate with Google ID Token
router.post('/google', googleSignIn);

// GET /api/auth/config - Check if Google Auth is configured
router.get('/config', getAuthConfig);

// GET & POST /api/auth/vault - End-to-End Encrypted Cloud Vault Sync
router.get('/vault', getVault);
router.post('/vault', saveVault);

export default router;

