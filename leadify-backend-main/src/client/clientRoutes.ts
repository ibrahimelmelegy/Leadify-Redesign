import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import clientController from './clientController';
import { CreateClientInput } from './inputs/createClientInput'; // DTO for body validation
import { GetClientsInput } from './inputs/getClientsInput';
import { UpdateClientInput } from './inputs/updateClientInput';
import { ClientPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */

/**
 * @swagger
 * /api/client/:
 *   post:
 *     summary: Create new client
 *     description: Create a new client with the provided details. Requires authentication.
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              leadId:
 *                type: string
 *                format: uuid
 *                description: Unique identifier for the lead, if applicable.
 *              clientName:
 *                type: string
 *                maxLength: 100
 *                description: Name of the client. Must be unique and not empty.
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 50
 *                description: Email address of the client. Required if phoneNumber is not provided.
 *              phoneNumber:
 *                type: string
 *                pattern: '^\\+\\d{1,14}$'
 *                maxLength: 15
 *                description: Phone number of the client. Required if email is not provided.
 *              companyName:
 *                type: string
 *                maxLength: 100
 *                description: Company name associated with the client, if applicable.
 *              clientType:
 *                type: string
 *                enum:
 *                  - INDIVIDUAL
 *                  - CORPORATE
 *                description: Type of client, either INDIVIDUAL or CORPORATE.
 *              streetAddress:
 *                type: string
 *                maxLength: 100
 *                description: Street address of the client.
 *              city:
 *                type: string
 *                maxLength: 50
 *                description: City of the client.
 *              state:
 *                type: string
 *                enum:
 *                  - ACTIVE
 *                  - INACTIVE
 *                description: State of the client. Defaults to ACTIVE.
 *              zipCode:
 *                type: string
 *                maxLength: 10
 *                description: Zip code of the client.
 *              industry:
 *                type: string
 *                description: Industry associated with the client.
 *                enum:
 *                  - Agriculture & Farming
 *                  - Automotive
 *                  - Banking & Financial Services
 *                  - Biotechnology & Pharmaceuticals
 *                  - Construction & Real Estate
 *                  - Consulting & Professional Services
 *                  - Consumer Goods & Retail
 *                  - Education & E-Learning
 *                  - Energy & Utilities
 *                  - Entertainment & Media
 *                  - Food & Beverage
 *                  - Government & Public Sector
 *                  - Healthcare & Medical Services
 *                  - Hospitality & Tourism
 *                  - Information Technology (IT) & Software
 *                  - Insurance
 *                  - Legal Services
 *                  - Manufacturing
 *                  - Marketing & Advertising
 *                  - Non-Profit & NGOs
 *                  - Telecommunications
 *                  - Transportation & Logistics
 *              users:
 *                type: array
 *                items:
 *                  type: number
 *                description: List of user IDs assigned to the proposal.
 *                example: [1, 2]
 *              clientStatus:
 *                type: string
 *                enum:
 *                  - ACTIVE
 *                  - INACTIVE
 *                description: Status of the client. Defaults to ACTIVE.
 *              fileUpload:
 *                type: array
 *                items:
 *                  type: string
 *                description: List of file paths for uploaded files associated with the client.
 *     responses:
 *       201:
 *         description: client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the client
 *                   example: c4e4bcf8-7e9c-4ed9-8e80-32e7eec1dbe6
 *                 clientName:
 *                   type: string
 *                   description: Name of the client
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   description: Email address of the lead
 *                   example: johndoe@example.com
 *                 phone:
 *                   type: string
 *                   description: Phone number of the lead
 *                   example: +1234567890
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post(
  '/',
  authenticateUser,
  HasPermission([ClientPermissionsEnum.CREATE_CLIENTS]),
  validateBody(CreateClientInput),
  clientController.createClient
);

//** --------------------- PUT --------------------- */

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Update Client
 *     description: Updates an existing client based on the provided fields. Requires authentication.
 *     tags: [Client]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Client to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              clientName:
 *                type: string
 *                maxLength: 100
 *                description: Name of the client. Must be unique and not empty.
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 50
 *                description: Email address of the client. Required if phoneNumber is not provided.
 *              phoneNumber:
 *                type: string
 *                pattern: '^\\+\\d{1,14}$'
 *                maxLength: 15
 *                description: Phone number of the client. Required if email is not provided.
 *              companyName:
 *                type: string
 *                maxLength: 100
 *                description: Company name associated with the client, if applicable.
 *              clientType:
 *                type: string
 *                enum:
 *                  - INDIVIDUAL
 *                  - CORPORATE
 *                description: Type of client, either INDIVIDUAL or CORPORATE.
 *              streetAddress:
 *                type: string
 *                maxLength: 100
 *                description: Street address of the client.
 *              city:
 *                type: string
 *                maxLength: 50
 *                description: City of the client.
 *              state:
 *                type: string
 *                enum:
 *                  - ACTIVE
 *                  - INACTIVE
 *                description: State of the client. Defaults to ACTIVE.
 *              zipCode:
 *                type: string
 *                maxLength: 10
 *                description: Zip code of the client.
 *              industry:
 *                type: string
 *                description: Industry associated with the client.
 *                enum:
 *                  - Agriculture & Farming
 *                  - Automotive
 *                  - Banking & Financial Services
 *                  - Biotechnology & Pharmaceuticals
 *                  - Construction & Real Estate
 *                  - Consulting & Professional Services
 *                  - Consumer Goods & Retail
 *                  - Education & E-Learning
 *                  - Energy & Utilities
 *                  - Entertainment & Media
 *                  - Food & Beverage
 *                  - Government & Public Sector
 *                  - Healthcare & Medical Services
 *                  - Hospitality & Tourism
 *                  - Information Technology (IT) & Software
 *                  - Insurance
 *                  - Legal Services
 *                  - Manufacturing
 *                  - Marketing & Advertising
 *                  - Non-Profit & NGOs
 *                  - Telecommunications
 *                  - Transportation & Logistics
 *              users:
 *                type: array
 *                items:
 *                  type: numbers
 *                description: List of user IDs assigned to the proposal.
 *                example: [1, 2]
 *              clientStatus:
 *                type: string
 *                enum:
 *                  - ACTIVE
 *                  - INACTIVE
 *                description: Status of the client. Defaults to ACTIVE.
 *              fileUpload:
 *                type: array
 *                items:
 *                  type: string
 *                description: List of file paths for uploaded files associated with the client.
 *     responses:
 *       200:
 *         description: client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Validation error
 *       603:
 *         description: client not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Client not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ClientPermissionsEnum.EDIT_CLIENTS]),
  validateBody(UpdateClientInput),
  clientController.updateClient
);

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/client/:
 *   get:
 *     summary: Get all clients
 *     tags: [Client]
 *     parameters:
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - "ASC"
 *             - "DESC"
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - "name"
 *             - "companyName"
 *             - "email"
 *             - "phone"
 *             - "clientsource"
 *             - "status"
 *             - "createdAt"
 *       - in: query
 *         name: fromLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter clients fromLastContactDate after this date (ISO 8601 format)
 *       - in: query
 *         name: toLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter clients toLastContactDate before this date (ISO 8601 format)
 *     responses:
 *       200:
 *         description: List of clients
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get(
  '/',
  authenticateUser,
  HasPermission([ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS, ClientPermissionsEnum.VIEW_OWN_CLIENTS]),
  validateQuery(GetClientsInput),
  clientController.getClients
);

/**
 * @swagger
 * /api/client/excel/{email}:
 *   get:
 *     summary: Send filtered clients as an Excel file to the specified email
 *     tags: [Client]
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
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key to filter clients
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by client status
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by client type
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
 *           enum:
 *             - name
 *             - companyName
 *             - email
 *             - phone
 *             - clientsource
 *             - status
 *             - createdAt
 *       - in: query
 *         name: fromLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter clients contacted after this date
 *       - in: query
 *         name: toLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter clients contacted before this date
 *     responses:
 *       200:
 *         description: Excel file sent successfully
 *       400:
 *         description: Invalid or missing email
 *       500:
 *         description: Internal server error
 */
router.get(
  '/excel/:email',
  authenticateUser,
  validateEmailParam,
  validateEmailConfiguration,
  HasPermission([ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS, ClientPermissionsEnum.VIEW_OWN_CLIENTS]),
  validateQuery(GetClientsInput),
  clientController.sendClientsExcelByEmail
);

/**
 * @swagger
 * /api/client/all:
 *   get:
 *     summary: Get all clients with name and id only
 *     tags: [Client]
 *     responses:
 *       200:
 *         description: clients array found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/all',
  authenticateUser,
  HasPermission([ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS, ClientPermissionsEnum.VIEW_OWN_CLIENTS]),
  clientController.clients
);

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Get a single clients by ID
 *     tags: [Client]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the clients to retrieve
 *     responses:
 *       200:
 *         description: client found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ClientPermissionsEnum.VIEW_GLOBAL_CLIENTS, ClientPermissionsEnum.VIEW_OWN_CLIENTS]),
  clientController.ClientById
);

//** --------------------- DELETE --------------------- */

export default router;
