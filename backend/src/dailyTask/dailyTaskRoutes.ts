import express from 'express';
import dailyTaskController from './dailyTaskController';
import { authenticateUser } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateDailyTaskInput } from './inputs/createDailyTaskInput';
import { UpdateDailyTaskInput } from './inputs/updateDailyTaskInput';
import { GetDailyTasksInput } from './inputs/getDailyTasksInput';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DailyTask
 *   description: Daily task management
 */

// ** --------------------- POST --------------------- **

/**
 * @swagger
 * /api/daily-task:
 *   post:
 *     summary: Create a new daily task
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - priority
 *               - cost
 *               - downPayment
 *               - totalPaid
 *               - userId
 *               - salesRepresentativeId
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Prepare marketing proposal"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "HIGH"
 *               salesRepresentativeId:
 *                 type: integer
 *                 example: 4
 *               userId:
 *                 type: integer
 *                 example: 2
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 example: "c2b9c0f5-7802-4d88-850a-f5c62ddcc48b"
 *               status:
 *                 type: string
 *                 enum: [WAITING_FOR_CONTRACT, CONTRACT_SIGNED, ACTIVE, ON_HOLD, COMPLETED]
 *                 example: "ACTIVE"
 *               cost:
 *                 type: number
 *                 example: 2000.50
 *               downPayment:
 *                 type: number
 *                 example: 500.00
 *               totalPaid:
 *                 type: number
 *                 example: 1500.00
 *               notes:
 *                 type: string
 *                 example: "Client prefers remote meeting"
 *     responses:
 *       201:
 *         description: Daily task created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', authenticateUser, validateBody(CreateDailyTaskInput), dailyTaskController.createDailyTask);

// ** --------------------- PUT --------------------- **

/**
 * @swagger
 * /api/daily-task/{id}:
 *   put:
 *     summary: Update a daily task
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the daily task to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *                 example: "2c8f57cc-4b32-4812-87e4-267e915b0c1e"
 *               name:
 *                 type: string
 *                 maxLength: 255
 *                 example: "Updated task name"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 example: "MEDIUM"
 *               salesRepresentativeId:
 *                 type: integer
 *                 example: 4
 *               userId:
 *                 type: integer
 *                 example: 3
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 example: "6adf2140-6d6e-4f26-8b84-bd96d377769d"
 *               status:
 *                 type: string
 *                 enum: [WAITING_FOR_CONTRACT, CONTRACT_SIGNED, ACTIVE, ON_HOLD, COMPLETED]
 *                 example: "COMPLETED"
 *               cost:
 *                 type: number
 *                 example: 3000.00
 *               downPayment:
 *                 type: number
 *                 example: 1000.00
 *               totalPaid:
 *                 type: number
 *                 example: 2500.00
 *               notes:
 *                 type: string
 *                 example: "Client requested more visuals in the final report"
 *     responses:
 *       200:
 *         description: Daily task updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Daily task not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateUser, validateBody(UpdateDailyTaskInput), dailyTaskController.updateDailyTask);

// ** --------------------- GET --------------------- **

/**
 * @swagger
 * /api/daily-task/statistics:
 *   get:
 *     summary: Get daily tasks statistics
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: statistics of daily tasks
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/statistics', authenticateUser, dailyTaskController.getDailyTasksStatistics);

/**
 * @swagger
 * /api/daily-task:
 *   get:
 *     summary: Get all daily tasks
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         description: Search text
 *       - in: query
 *         name: status
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [WAITING_FOR_CONTRACT, CONTRACT_SIGNED, ACTIVE, ON_HOLD, COMPLETED]
 *         style: form
 *         explode: false
 *         description: Comma-separated list of statuses to filter by
 *     responses:
 *       200:
 *         description: List of daily tasks
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateUser, validateQuery(GetDailyTasksInput), dailyTaskController.getDailyTasks);

/**
 * @swagger
 * /api/daily-task/{id}:
 *   get:
 *     summary: Get a daily task by ID
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the daily task
 *     responses:
 *       200:
 *         description: Daily task found
 *       404:
 *         description: Daily task not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, dailyTaskController.getDailyTaskById);

// ** --------------------- DELETE --------------------- **

/**
 * @swagger
 * /api/daily-task/{id}:
 *   delete:
 *     summary: Delete a daily task by ID
 *     tags: [DailyTask]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the daily task to delete
 *     responses:
 *       200:
 *         description: Daily task deleted successfully
 *       404:
 *         description: Daily task not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, dailyTaskController.deleteDailyTask);

export default router;
