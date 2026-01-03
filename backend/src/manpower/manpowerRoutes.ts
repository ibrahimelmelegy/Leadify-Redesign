import express from 'express';
import manpowerController from './manpowerController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateManpowerInput } from './inputs/createManpowerInput';
import { UpdateManpowerInput } from './inputs/updateManpowerInput';
import { GetManpowersInput } from './inputs/getManpowersInput';
import { ManpowerPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/manpower/:
 *   post:
 *     summary: Create new manpower profile
 *     description: Create a new manpower profile with the provided details. Requires authentication.
 *     tags: [Manpower]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the manpower
 *                 maxLength: 100
 *                 example: John Doe
 *               nationality:
 *                 type: string
 *                 description: Nationality of the manpower
 *                 example: American
 *               email:
 *                 type: string
 *                 description: Email address of the manpower
 *                 maxLength: 100
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 description: Phone number of the manpower (international format)
 *                 maxLength: 15
 *                 example: +1234567890
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - PRE_SALES
 *                     - NETWORK_ENGINEER
 *                     - SITE_ENGINEER
 *                     - PROJECT_MANAGER
 *                     - TECHNICIAN
 *                     - HELPER
 *                 description: Array of roles for the manpower
 *                 example: [ "TECHNICIAN", "SITE_ENGINEER" ]
 *               availabilityStatus:
 *                 type: string
 *                 description: Availability status of the manpower
 *                 enum:
 *                   - AVAILABLE
 *                   - NOT_AVAILABLE
 *                 example: AVAILABLE
 *               salary:
 *                 type: number
 *                 format: float
 *                 description: Monthly salary of the manpower
 *                 example: 1000.00
 *               variableAllowance:
 *                 type: number
 *                 format: float
 *                 description: Variable allowance for the manpower
 *                 example: 500.00
 *               transportationAllowance:
 *                 type: number
 *                 format: float
 *                 description: Transportation allowance for the manpower
 *                 example: 200.00
 *               iqamaCost:
 *                 type: number
 *                 format: float
 *                 description: Iqama cost for the manpower
 *                 example: 300.00
 *               endOfServiceBenefit:
 *                 type: number
 *                 format: float
 *                 description: End of service benefit for the manpower
 *                 example: 400.00
 *               saudization:
 *                 type: number
 *                 format: float
 *                 description: Saudization fee for the manpower
 *                 example: 0.00
 *               visaFees:
 *                 type: number
 *                 format: float
 *                 description: Visa fees for the manpower
 *                 example: 150.00
 *               incomingFlightTicket:
 *                 type: number
 *                 format: float
 *                 description: Incoming flight ticket cost for the manpower
 *                 example: 500.00
 *               healthInsurance:
 *                 type: number
 *                 format: float
 *                 description: Health insurance cost for the manpower
 *                 example: 250.00
 *               generalOrganizationForSocialInsurance:
 *                 type: number
 *                 format: float
 *                 description: GOSI cost for the manpower
 *                 example: 150.00
 *               notes:
 *                 type: string
 *                 description: Additional notes about the manpower
 *                 maxLength: 500
 *                 example: This is an experienced engineer.
 *     responses:
 *       201:
 *         description: Manpower profile created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ManpowerPermissionsEnum.CREATE_MANPOWER]),
  validateBody(CreateManpowerInput),
  manpowerController.createManpower
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/manpower/{id}:
 *   put:
 *     summary: Update manpower profile
 *     description: Updates an existing manpower profile based on the provided fields. Requires authentication.
 *     tags: [Manpower]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manpower profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name of the manpower
 *                 maxLength: 100
 *               nationality:
 *                 type: string
 *                 description: Nationality of the manpower
 *               email:
 *                 type: string
 *                 description: Valid email address of the manpower
 *                 maxLength: 100
 *               phone:
 *                 type: string
 *                 description: Valid international phone number of the manpower
 *                 maxLength: 15
 *               role:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum:
 *                     - PRE_SALES
 *                     - NETWORK_ENGINEER
 *                     - SITE_ENGINEER
 *                     - PROJECT_MANAGER
 *                     - TECHNICIAN
 *                     - HELPER
 *                 description: Array of roles for the manpower
 *                 example: [ "TECHNICIAN", "SITE_ENGINEER" ]
 *               availabilityStatus:
 *                 type: string
 *                 description: Availability status of the manpower
 *                 enum:
 *                   - AVAILABLE
 *                   - NOT_AVAILABLE
 *               salary:
 *                 type: number
 *                 format: float
 *                 description: Monthly salary of the manpower
 *               variableAllowance:
 *                 type: number
 *                 format: float
 *                 description: Variable allowance for the manpower
 *               transportationAllowance:
 *                 type: number
 *                 format: float
 *                 description: Transportation allowance for the manpower
 *               iqamaCost:
 *                 type: number
 *                 format: float
 *                 description: Iqama cost for the manpower
 *               endOfServiceBenefit:
 *                 type: number
 *                 format: float
 *                 description: End of service benefit for the manpower
 *               notes:
 *                 type: string
 *                 description: Additional notes for the manpower
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Manpower profile updated successfully
 *       400:
 *         description: Validation error
 *       608:
 *         description: Manpower profile not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ManpowerPermissionsEnum.EDIT_MANPOWER]),
  validateBody(UpdateManpowerInput),
  manpowerController.updateManpower
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/manpower/:
 *   get:
 *     summary: Get all manpower profiles
 *     tags: [Manpower]
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
 *           default: 10
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering manpower profiles
 *       - in: query
 *         name: availabilityStatus
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: role
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: fromSalary
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toSalary
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromVariableAllowance
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toVariableAllowance
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromTransportationAllowance
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toTransportationAllowance
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromIqamaCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toIqamaCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromTotalCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toTotalCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromDailyCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: toDailyCost
 *         required: false
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name, role, availabilityStatus, salary, variableAllowance, transportationAllowance, createdAt, iqamaCost, EOF, totalCost, dailyCost]
 *     responses:
 *       200:
 *         description: List of manpower profiles
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ManpowerPermissionsEnum.VIEW_MANPOWER]),
  validateQuery(GetManpowersInput),
  manpowerController.getManpowers
);

/**
 * @swagger
 * /api/manpower/excel/{email}:
 *   get:
 *     summary: Send filtered manpower profiles as an Excel file to the specified email
 *     tags: [Manpower]
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
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         description: Search key for filtering manpower profiles
 *       - in: query
 *         name: availabilityStatus
 *         schema:
 *           type: string
 *         description: Filter by availability status
 *       - in: query
 *         name: role
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by manpower role(s)
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fromSalary
 *         schema:
 *           type: number
 *       - in: query
 *         name: toSalary
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromDailyCost
 *         schema:
 *           type: number
 *       - in: query
 *         name: toDailyCost
 *         schema:
 *           type: number
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
  HasPermission([ManpowerPermissionsEnum.VIEW_MANPOWER]),
  validateQuery(GetManpowersInput),
  manpowerController.sendManpowerExcelByEmail
);

/**
 * @swagger
 * /api/manpower/{id}:
 *   get:
 *     summary: Get a single manpower profile by ID
 *     tags: [Manpower]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the manpower profile to retrieve
 *     responses:
 *       200:
 *         description: Manpower profile found
 *       608:
 *         description: Manpower profile not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, HasPermission([ManpowerPermissionsEnum.VIEW_MANPOWER]), manpowerController.manpowerById);

// ** --------------------- DELETE --------------------- **/

export default router;
