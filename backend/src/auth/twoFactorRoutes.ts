import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { generateTwoFactorSecret, verifyTwoFactorToken, generateBackupCodes } from '../utils/twoFactorAuth';
import { logAudit } from '../audit/auditService';
import User from '../user/userModel';

const router = express.Router();

router.post('/setup', authenticateUser, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled' });
    }

    const secret = await generateTwoFactorSecret(user.email);
    
    await user.update({ twoFactorSecret: secret.secret });

    res.json({
      message: '2FA setup initiated',
      qrCode: secret.qrCode,
      secret: secret.secret,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ message: 'Failed to setup 2FA' });
  }
});

router.post('/verify', authenticateUser, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const user = await User.findByPk(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not setup' });
    }

    const isValid = verifyTwoFactorToken(user.twoFactorSecret, token);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const backupCodes = generateBackupCodes(10);

    await user.update({
      twoFactorEnabled: true,
      backupCodes,
    });

    await logAudit({
      userId,
      action: '2FA_ENABLED',
      entityType: 'USER',
      entityId: userId,
      req,
    });

    res.json({
      message: '2FA enabled successfully',
      backupCodes,
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    res.status(500).json({ message: 'Failed to verify 2FA' });
  }
});

router.post('/disable', authenticateUser, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { token, password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    if (user.twoFactorEnabled && user.twoFactorSecret) {
      const isValid = verifyTwoFactorToken(user.twoFactorSecret, token);
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid 2FA token' });
      }
    }

    await user.update({
      twoFactorEnabled: false,
      twoFactorSecret: null,
      backupCodes: null,
    });

    await logAudit({
      userId,
      action: '2FA_DISABLED',
      entityType: 'USER',
      entityId: userId,
      req,
    });

    res.json({ message: '2FA disabled successfully' });
  } catch (error) {
    console.error('2FA disable error:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
});

router.get('/status', authenticateUser, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      enabled: user.twoFactorEnabled,
      hasBackupCodes: !!(user.backupCodes && user.backupCodes.length > 0),
    });
  } catch (error) {
    console.error('2FA status error:', error);
    res.status(500).json({ message: 'Failed to get 2FA status' });
  }
});

router.post('/regenerate-backup-codes', authenticateUser, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const backupCodes = generateBackupCodes(10);
    await user.update({ backupCodes });

    res.json({
      message: 'Backup codes regenerated',
      backupCodes,
    });
  } catch (error) {
    console.error('Regenerate backup codes error:', error);
    res.status(500).json({ message: 'Failed to regenerate backup codes' });
  }
});

export default router;
