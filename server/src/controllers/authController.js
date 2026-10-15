import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Novel from '../models/Novel.js';
import { isConnectedToAtlas } from '../config/db.js';
import { memoryStore } from '../store/memoryStore.js';

const client = new OAuth2Client();

/**
 * Handle Google Sign-In with ID Token verification
 * POST /api/auth/google
 * Body: { credential: string }
 */
export async function googleSignIn(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Google ID token credential is required.',
      });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    // Verify token using google-auth-library
    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: clientId || undefined, // If set, enforces audience check
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('[Auth] Token verification failed:', verifyError.message);
      return res.status(401).json({
        success: false,
        error: `Failed to verify Google token: ${verifyError.message}`,
      });
    }

    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token payload received from Google.',
      });
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const penName = payload.name || email.split('@')[0];
    const avatarUrl = payload.picture || '';

    let user;

    if (isConnectedToAtlas()) {
      // Find by googleId or email
      user = await User.findOne({ $or: [{ googleId }, { email }] });

      if (user) {
        let shouldSave = false;
        if (!user.googleId) {
          user.googleId = googleId;
          shouldSave = true;
        }
        if (avatarUrl && !user.avatarUrl) {
          user.avatarUrl = avatarUrl;
          shouldSave = true;
        }
        if (shouldSave) {
          await user.save();
        }
      } else {
        user = await User.create({
          googleId,
          email,
          penName,
          avatarUrl,
          authProvider: 'google',
        });
      }

      // Auto-adopt any previous guest novels matching the author's penName or guest ID
      await Novel.updateMany(
        { $or: [{ author: user.penName }, { userId: { $regex: '^user_' } }] },
        { $set: { userId: user._id.toString(), author: user.penName } }
      ).catch(() => {});
    } else {
      // Hybrid Local Memory Store fallback
      user = memoryStore.createOrUpdateGoogleUser({
        googleId,
        email,
        penName,
        avatarUrl,
      });
    }

    return res.json({
      success: true,
      message: 'Successfully authenticated with Google',
      user: {
        id: user._id.toString(),
        googleId: user.googleId,
        email: user.email,
        penName: user.penName,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('[Auth] Google sign in error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Authentication error',
    });
  }
}

/**
 * Get authentication configuration status
 * GET /api/auth/config
 */
export function getAuthConfig(req, res) {
  const isConfigured = Boolean(process.env.GOOGLE_CLIENT_ID);
  res.json({
    success: true,
    googleAuthEnabled: isConfigured,
    clientIdConfigured: isConfigured,
  });
}

/**
 * Retrieve encrypted API vault for the authenticated user
 * GET /api/auth/vault
 */
export async function getVault(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID is required' });
    }

    if (isConnectedToAtlas()) {
      const user =
        (await User.findById(userId).catch(() => null)) ||
        (await User.findOne({ $or: [{ googleId: userId }, { email: userId }] }));
      if (!user) {
        return res.json({ success: true, encryptedVault: '', vaultUpdatedAt: null });
      }
      return res.json({
        success: true,
        encryptedVault: user.encryptedVault || '',
        vaultUpdatedAt: user.vaultUpdatedAt || null,
      });
    }

    const data = memoryStore.getUserVault(userId);
    return res.json({
      success: true,
      encryptedVault: data?.encryptedVault || '',
      vaultUpdatedAt: data?.vaultUpdatedAt || null,
    });
  } catch (err) {
    console.error('[Auth] getVault error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Save encrypted API vault for the authenticated user
 * POST /api/auth/vault
 * Body: { encryptedVault: string }
 */
export async function saveVault(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    const { encryptedVault } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID is required' });
    }

    if (typeof encryptedVault !== 'string') {
      return res.status(400).json({ success: false, error: 'encryptedVault string is required' });
    }

    const now = new Date();

    if (isConnectedToAtlas()) {
      let user =
        (await User.findById(userId).catch(() => null)) ||
        (await User.findOne({ $or: [{ googleId: userId }, { email: userId }] }));
      if (user) {
        user.encryptedVault = encryptedVault;
        user.vaultUpdatedAt = now;
        await user.save();
      } else {
        user = await User.create({
          googleId: userId,
          email: `${userId}@alterjot.local`,
          penName: 'Author',
          encryptedVault,
          vaultUpdatedAt: now,
          authProvider: 'local',
        });
      }
      return res.json({
        success: true,
        message: 'Encrypted vault saved successfully to cloud',
        vaultUpdatedAt: user.vaultUpdatedAt,
      });
    }

    memoryStore.updateUserVault(userId, encryptedVault);
    return res.json({
      success: true,
      message: 'Encrypted vault saved successfully to cloud store',
      vaultUpdatedAt: now.toISOString(),
    });
  } catch (err) {
    console.error('[Auth] saveVault error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
