import express from 'express';
import opportunityController from './notificationController';
import { authenticateUser } from '../middleware/authMiddleware';
import { validateQuery } from '../middleware/validation';
import { GetNotificationsInput } from './inputs/getNotificationsInput';
import notificationController from './notificationController';

const router = express.Router();

//** --------------------- POST --------------------- */

//** --------------------- PUT --------------------- */
/**
 * @swagger
 * /api/notification/:
 *   put:
 *     summary: Update notifacations to read
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/', authenticateUser, notificationController.updateNotificationsToRead);

/**
 * @swagger
 * /api/notification/click/{id}:
 *   put:
 *     summary: Update notifacation to clicked
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the notification to update
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *       400:
 *         description: Validation error
 *       605:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
router.put('/click/:id', authenticateUser, notificationController.updateNotificationToClicked);
//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/notification/:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notification]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: The page number for pagination
 *         example: "1"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: The number of records per page
 *         example: "20"
 *     responses:
 *       200:
 *         description: List of notifications
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticateUser, validateQuery(GetNotificationsInput), opportunityController.getNotifications);

//** --------------------- DELETE --------------------- */

export default router;
