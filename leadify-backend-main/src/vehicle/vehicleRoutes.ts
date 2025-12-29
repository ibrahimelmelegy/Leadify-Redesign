import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateVehicleInput, UpdateVehicleInput } from './inputs/create-vehicle.input';
import { GetPaginatedVehicleInput } from './inputs/paginated-vehicle.input';
import vehicleController from './vehicle.controller';
import { VehiclePermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */
/**
 *
 * @swagger
 * /api/vehicle/create:
 *  post:
 *   summary: Create a new vehicle
 *   tags: [Vehicle ]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            rentCost:
 *              type: integer
 *              example: 1000
 *            gasCost:
 *              type: integer
 *              example: 1000
 *            oilCost:
 *              type: integer
 *              example: 1000
 *            manufacturer:
 *              type: string
 *              enum:
 *                - "Sedan"
 *                - "Changan_Hunter"
 *                - "Other"
 *            plate:
 *              type: string
 *              example: asd123
 *            regularMaintenanceCost:
 *              type: integer
 *              example: 0
 *   responses:
 *    201:
 *      description: Vehicle created successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *    400:
 *      description: Bad request
 *    500:
 *      description: Internal server error
 */

router.post(
  '/create',
  authenticateUser,
  HasPermission([VehiclePermissionsEnum.CREATE_VEHICLES]),
  validateBody(CreateVehicleInput),
  vehicleController.createVehicle
);

//** --------------------- PUT --------------------- */

/**
 *
 * @swagger
 * /api/vehicle/update:
 *  post:
 *   summary: update an existing vehicle
 *   tags: [Vehicle ]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            vehicleId:
 *              type: integer
 *              example: 12
 *            rentCost:
 *              type: integer
 *              example: 1000
 *            gasCost:
 *              type: integer
 *              example: 1000
 *            oilCost:
 *              type: integer
 *              example: 1000
 *            manufacturer:
 *              type: string
 *              enum:
 *                - "Sedan"
 *                - "Changan_Hunter"
 *                - "Other"
 *            plate:
 *              type: string
 *              example: asd123
 *            regularMaintenanceCost:
 *              type: integer
 *              example: 0
 *   responses:
 *    201:
 *      description: Vehicle updated successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *    400:
 *      description: Bad request
 *    500:
 *      description: Internal server error
 */
router.post(
  '/update',
  authenticateUser,
  HasPermission([VehiclePermissionsEnum.EDIT_VEHICLES]),
  validateBody(UpdateVehicleInput),
  vehicleController.updateVehicle
);

//** --------------------- GET --------------------- */
/**
 * @swagger
 * /api/vehicle/:
 *   get:
 *     summary: Get paginated list of vehicles
 *     tags: [Vehicle]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         required: false
 *         description: Number of items per page
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         required: false
 *         description: Search keyword for filtering vehicles
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Sedan
 *               - Changan_Hunter
 *               - Other
 *         required: false
 *         description: Filter vehicles by one or more manufacturers
 *       - in: query
 *         name: fromRentCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum rent cost
 *       - in: query
 *         name: toRentCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum rent cost
 *       - in: query
 *         name: fromGasCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum gas cost
 *       - in: query
 *         name: toGasCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum gas cost
 *       - in: query
 *         name: fromOilCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum oil cost
 *       - in: query
 *         name: toOilCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum oil cost
 *       - in: query
 *         name: fromRegularMaintenanceCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum regular maintenance cost
 *       - in: query
 *         name: toRegularMaintenanceCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum regular maintenance cost
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort direction (ascending or descending)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rentCost, gasCost, oilCost]
 *         required: false
 *         description: Field to sort by
 *     responses:
 *       200:
 *         description: Successfully retrieved list of vehicles
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([VehiclePermissionsEnum.VIEW_VEHICLES]),
  validateQuery(GetPaginatedVehicleInput),
  vehicleController.getVehicles
);

/**
 * @swagger
 * /api/vehicle/excel/{email}:
 *   get:
 *     summary: Send filtered vehicle list as an Excel file to the specified email
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Recipient email address
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         required: false
 *         description: Search keyword for filtering vehicles
 *       - in: query
 *         name: manufacturer
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - Sedan
 *               - Changan_Hunter
 *               - Other
 *         required: false
 *         description: Filter vehicles by one or more manufacturers
 *       - in: query
 *         name: fromRentCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum rent cost
 *       - in: query
 *         name: toRentCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum rent cost
 *       - in: query
 *         name: fromGasCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum gas cost
 *       - in: query
 *         name: toGasCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum gas cost
 *       - in: query
 *         name: fromOilCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum oil cost
 *       - in: query
 *         name: toOilCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum oil cost
 *       - in: query
 *         name: fromRegularMaintenanceCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Minimum regular maintenance cost
 *       - in: query
 *         name: toRegularMaintenanceCost
 *         schema:
 *           type: number
 *         required: false
 *         description: Maximum regular maintenance cost
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rentCost, gasCost, oilCost, createdAt]
 *         required: false
 *         description: Field to sort by
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Sort direction (ascending or descending)
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
  HasPermission([VehiclePermissionsEnum.VIEW_VEHICLES]),
  validateQuery(GetPaginatedVehicleInput),
  vehicleController.sendVehiclesExcelByEmail
);
/**
 * @swagger
 * /api/vehicle/{id}:
 *  get:
 *   summary: Get a vehicle by ID
 *   tags: [Vehicle ]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID of the vehicle to retrieve
 *   responses:
 *     200:
 *       description: Successfully retrieved vehicle
 *     404:
 *       description: Vehicle not found
 *     500:
 *       description: Internal server error
 *
 */
router.get('/:id', authenticateUser, HasPermission([VehiclePermissionsEnum.VIEW_VEHICLES]), vehicleController.getVehicleById);

export default router;
