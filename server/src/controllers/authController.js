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

      // Auto-adopt any previous guest API vault if user's vault is currently empty
      if (!user.encryptedVault || user.encryptedVault.length < 120) {
        const guestWithVault = await User.findOne({
          googleId: { $regex: '^user_' },
          encryptedVault: { $exists: true, $ne: '' },
          $expr: { $gt: [{ $strLenCP: '$encryptedVault' }, 120] },
        }).sort({ vaultUpdatedAt: -1, createdAt: -1 });

        if (guestWithVault && guestWithVault.encryptedVault) {
          console.log(`[Auth] Auto-adopting guest vault from ${guestWithVault.googleId} to ${user.email}`);
          user.encryptedVault = guestWithVault.encryptedVault;
          user.vaultUpdatedAt = guestWithVault.vaultUpdatedAt || new Date();
          await user.save().catch(() => {});
        }
      }
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
      let user =
        (await User.findById(userId).catch(() => null)) ||
        (await User.findOne({ $or: [{ googleId: userId }, { email: userId }] }));
      if (!user) {
        return res.json({ success: true, encryptedVault: '', vaultUpdatedAt: null });
      }

      // If user's vault is empty, check if an unlinked guest vault exists to adopt
      if (!user.encryptedVault || user.encryptedVault.length < 120) {
        const guestWithVault = await User.findOne({
          googleId: { $regex: '^user_' },
          encryptedVault: { $exists: true, $ne: '' },
          $expr: { $gt: [{ $strLenCP: '$encryptedVault' }, 120] },
        }).sort({ vaultUpdatedAt: -1, createdAt: -1 });

        if (guestWithVault && guestWithVault.encryptedVault) {
          console.log(`[Auth] getVault: linking legacy guest vault to ${user.email}`);
          user.encryptedVault = guestWithVault.encryptedVault;
          user.vaultUpdatedAt = guestWithVault.vaultUpdatedAt || new Date();
          await user.save().catch(() => {});
        }
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
 * Body: { encryptedVault: string, forceEmpty?: boolean }
 */
export async function saveVault(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    const { encryptedVault, forceEmpty } = req.body;

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
        // Guard: Prevent empty vault payload from overwriting an already populated cloud vault
        const isExistingPopulated = user.encryptedVault && user.encryptedVault.length > 150;
        const isNewEmpty = encryptedVault.length < 120;
        if (isExistingPopulated && isNewEmpty && !forceEmpty) {
          console.log(`[Auth] Shielding populated vault for ${user.email || user._id} from empty overwrite`);
          return res.json({
            success: true,
            message: 'Preserved existing cloud vault against empty payload',
            vaultUpdatedAt: user.vaultUpdatedAt,
          });
        }

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

/**
 * Retrieve authenticated author profile
 * GET /api/auth/me
 */
export async function getCurrentUser(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.query.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (isConnectedToAtlas()) {
      const user =
        (await User.findById(userId).catch(() => null)) ||
        (await User.findOne({ $or: [{ googleId: userId }, { email: userId }] }));

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        user: {
          id: user._id.toString(),
          googleId: user.googleId,
          email: user.email,
          penName: user.penName,
          avatarUrl: user.avatarUrl,
        },
      });
    }

    const memUser = memoryStore.findUserById(userId) || memoryStore.users.find((u) => u.googleId === userId);
    if (!memUser) {
      return res.status(404).json({ success: false, error: 'User not found in memory store' });
    }

    return res.json({
      success: true,
      user: {
        id: memUser._id || userId,
        googleId: memUser.googleId,
        email: memUser.email,
        penName: memUser.penName,
        avatarUrl: memUser.avatarUrl,
      },
    });
  } catch (err) {
    console.error('[Auth] getCurrentUser error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * Update author profile (e.g. pen name) directly in MongoDB Atlas
 * PATCH /api/auth/profile
 * Body: { penName: string }
 */
export async function updateProfile(req, res) {
  try {
    const userId = req.headers['x-user-id'] || req.body.userId;
    const { penName } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!penName || typeof penName !== 'string' || !penName.trim()) {
      return res.status(400).json({ success: false, error: 'A valid penName is required' });
    }

    const cleanPenName = penName.trim();

    if (isConnectedToAtlas()) {
      const user =
        (await User.findById(userId).catch(() => null)) ||
        (await User.findOne({ $or: [{ googleId: userId }, { email: userId }] }));

      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      user.penName = cleanPenName;
      await user.save();

      // Cascade update author name on all of this author's manuscripts
      await Novel.updateMany(
        { userId: user._id.toString() },
        { $set: { author: cleanPenName } }
      ).catch(() => {});

      console.log(`[Auth] Updated penName to "${cleanPenName}" for user ${user.email} (${user._id})`);

      return res.json({
        success: true,
        message: 'Pen name updated successfully in cloud database',
        user: {
          id: user._id.toString(),
          googleId: user.googleId,
          email: user.email,
          penName: user.penName,
          avatarUrl: user.avatarUrl,
        },
      });
    }

    const memUser = memoryStore.updateUserPenName(userId, cleanPenName);
    return res.json({
      success: true,
      message: 'Pen name updated in memory store',
      user: {
        id: userId,
        penName: cleanPenName,
      },
    });
  } catch (err) {
    console.error('[Auth] updateProfile error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
