import express from 'express';
import serviceController from './serviceController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateServiceInput } from './inputs/createServiceInput';
import { UpdateServiceInput } from './inputs/updateServiceInput';
import { GetServicesInput } from './inputs/getServicesInput';
import { ServicePermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/service/:
 *   post:
 *     summary: Create new service
 *     description: Create a new service with the provided details. Requires authentication.
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the service
 *                 maxLength: 100
 *                 example: Cleaning
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the service
 *                 example: 200.50
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ServicePermissionsEnum.CREATE_SERVICES]),
  validateBody(CreateServiceInput),
  serviceController.createService
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/service/{id}:
 *   put:
 *     summary: Update service
 *     description: Updates an existing service based on the provided fields. Requires authentication.
 *     tags: [Service]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the service to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the service
 *                 maxLength: 100
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the service
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         description: Validation error
 *       616:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ServicePermissionsEnum.EDIT_SERVICES]),
  validateBody(UpdateServiceInput),
  serviceController.updateService
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/service/:
 *   get:
 *     summary: Get all services
 *     tags: [Service]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering services
 *       - in: query
 *         name: fromPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter  price after this pice
 *       - in: query
 *         name: toPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter  pice before this pice
 *     responses:
 *       200:
 *         description: List of services
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ServicePermissionsEnum.VIEW_SERVICES]),
  validateQuery(GetServicesInput),
  serviceController.getServices
);

/**
 * @swagger
 * /api/service/excel/{email}:
 *   get:
 *     summary: Send filtered services as an Excel file to the specified email
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Recipient email address
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key to filter services by type
 *       - in: query
 *         name: fromPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter  price after this pice
 *       - in: query
 *         name: toPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter  pice before this pice
 *     responses:
 *       200:
 *         description: Excel file sent successfully
 *       400:
 *         description: Invalid or missing email
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/excel/:email',
  authenticateUser,
  validateEmailParam,
  validateEmailConfiguration,
  HasPermission([ServicePermissionsEnum.VIEW_SERVICES]),
  validateQuery(GetServicesInput),
  serviceController.sendServicesExcelByEmail
);

/**
 * @swagger
 * /api/service/{id}:
 *   get:
 *     summary: Get a single service by ID
 *     tags: [Service]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the service to retrieve
 *     responses:
 *       200:
 *         description: Service found
 *       616:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, HasPermission([ServicePermissionsEnum.VIEW_SERVICES]), serviceController.serviceById);

export default router;
