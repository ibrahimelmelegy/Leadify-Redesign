import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { getAuditLogs } from './auditService';

const router = express.Router();

router.get('/', authenticateUser, HasPermission(['all']), async (req: any, res) => {
  try {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const logs = await getAuditLogs({
      userId: userId ? parseInt(userId) : undefined,
      action: action as string,
      entityType: entityType as string,
      entityId: entityId ? parseInt(entityId) : undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 50,
    });

    res.json(logs);
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Failed to get audit logs' });
  }
});

router.get('/user/:userId', authenticateUser, HasPermission(['all']), async (req: any, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const logs = await getAuditLogs({
      userId: parseInt(userId),
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 50,
    });

    res.json(logs);
  } catch (error) {
    console.error('Get user audit logs error:', error);
    res.status(500).json({ message: 'Failed to get user audit logs' });
  }
});

router.get('/entity/:entityType/:entityId', authenticateUser, HasPermission(['all']), async (req: any, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const logs = await getAuditLogs({
      entityType,
      entityId: parseInt(entityId),
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 50,
    });

    res.json(logs);
  } catch (error) {
    console.error('Get entity audit logs error:', error);
    res.status(500).json({ message: 'Failed to get entity audit logs' });
  }
});

export default router;
