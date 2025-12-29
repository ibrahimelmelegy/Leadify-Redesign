import express, { Response } from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { getActivityLogs } from './activityService';
import { wrapResult } from '../utils/response/responseWrapper';
import { NextFunction } from 'express-serve-static-core';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * /api/activity/{model}/{id}:
 *   get:
 *     summary: Get a model activities by ID
 *     tags: [Activity]
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *       - in: path
 *         name: kimit
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Activities found
 *       404:
 *         description: Activities not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/:model/:id', authenticateUser, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const responseFromService = await getActivityLogs(req.params?.model as any, req.params?.id, req.query?.page as any, req.query?.limit as any);
    wrapResult(res, responseFromService);
  } catch (error) {
    next(error);
  }
});

export default router;
