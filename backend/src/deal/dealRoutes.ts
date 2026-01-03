import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import dealController from './dealController';
import { ConvertLeadToDealInput, CreateLeadAndDealInput } from './inputs/convert-lead-to-deal.input';
import { GetPaginatedDealsInput } from './inputs/paginated-deals.input';
import { UpdateDealInput } from './inputs/update-deal.input';
import { DealPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */

/**
 * @swagger
 * /api/deal/create:
 *   post:
 *     summary: create deal details
 *     description: Create deal with the provided details. Requires authentication.
 *     tags: [Deal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lead:
 *                 type: object
 *                 required:
 *                   - name
 *                   - email
 *                   - phone
 *                   - userId
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Name of the lead
 *                     maxLength: 100
 *                     example: John Doe
 *                   companyName:
 *                     type: string
 *                     description: Name of the company
 *                     maxLength: 100
 *                     example: ABC Corp
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Email of the lead
 *                     maxLength: 100
 *                     example: johndoe@example.com
 *                   phone:
 *                     type: string
 *                     description: Phone number of the lead in international format
 *                     pattern: "^\\+?[0-9]{1,15}$"
 *                     example: "+123456789"
 *                   userId:
 *                     type: integer
 *                     description: ID of the user assigned to the lead
 *                     example: 1
 *               deal:
 *                 type: object
 *                 required:
 *                   - name
 *                   - price
 *                   - contractType
 *                   - stage
 *                   - signatureDate
 *                 properties:
 *                   userId:
 *                     type: integer
 *                     description: ID of the user assigned to the lead
 *                     example: 1
 *                   name:
 *                      type: string
 *                      description: Name of the deal
 *                      maxLength: 100
 *                      example: New Business deal
 *                   companyName:
 *                      type: string
 *                      description: Name of the company
 *                      maxLength: 100
 *                      example: Company Business name
 *                   price:
 *                      type: integer
 *                      description: deal price
 *                      example: 2000
 *                   contractType:
 *                      type: string
 *                      description: contract type of the deal
 *                      enum:
 *                        - Contract
 *                        - PurchaseOrder
 *                      example: Contract
 *                   stage:
 *                      type: string
 *                      description: Stage of the deal
 *                      enum:
 *                        - PROGRESS
 *                        - CANCELLED
 *                        - CLOSED
 *                      example: PROGRESS
 *                   cancelledReason:
 *                      type: string
 *                      description: Reason for cancellation
 *                      required: false
 *                   signatureDate:
 *                      type: string
 *                      format: date
 *                      description: signature Date of the deal
 *                      example: 2024-12-31
 *               opportunityId:
 *                type: string
 *                description: User ID of the user creating the deal
 *                example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *               deliveryDetails:
 *                type: array
 *                description: List of delivery details for the deal
 *                items:
 *                  type: object
 *                example: [{deliveryDetails: delivery details text, deliveryDate: 2024-12-31}, {deliveryDetails: delivery details text, deliveryDate: 2024-12-31}]
 *               invoiceDetails:
 *                type: array
 *                description: List of invoice details for the deal
 *                items:
 *                  type: object
 *                example: [{invoiceNumber: xas21dsadawa,invoiceDate: 2024-12-31, amount: 5000}, {invoiceNumber: xas21dsadawa, amount: 2000,invoiceDate: 2024-12-31,  collected: true, collectedDate: 2024-12-31}]
 *     responses:
 *       201:
 *         description: deal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the deal
 *                   example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *                 name:
 *                   type: string
 *                   description: Name of the deal
 *                   example: New Business deal
 *                 stage:
 *                   type: string
 *                   description: Current stage of the deal
 *                   example: PROGRESS
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/create',
  authenticateUser,
  HasPermission([DealPermissionsEnum.CREATE_DEALS]),
  validateBody(CreateLeadAndDealInput),
  dealController.createDeal
);

/**
 * @swagger
 * /api/deal/convert-lead:
 *   post:
 *     summary: Convert existing lead to deal
 *     description: Convert existing lead to deal with the provided details. Requires authentication.
 *     tags: [Deal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leadId:
 *                 type: string
 *                 description: id of the lead
 *                 example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *               opportunityId:
 *                 type: string
 *                 description: id of the lead
 *                 example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *               name:
 *                 type: string
 *                 description: Name of the deal
 *                 maxLength: 100
 *                 example: New Business deal
 *               companyName:
 *                 type: string
 *                 description: Name of the company
 *                 maxLength: 100
 *                 example: Company Business name
 *               price:
 *                 type: integer
 *                 description: deal price
 *                 example: 2000
 *               contractType:
 *                 type: string
 *                 description: contract type of the deal
 *                 enum:
 *                   - Contract
 *                   - PurchaseOrder
 *                 example: Contract
 *               stage:
 *                 type: string
 *                 description: Stage of the deal
 *                 enum:
 *                   - PROGRESS
 *                   - CANCELLED
 *                   - CLOSED
 *                 example: PROGRESS
 *               cancelledReason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 required: false
 *               signatureDate:
 *                 type: string
 *                 format: date
 *                 description: signature Date of the deal
 *                 example: 2024-12-31
 *               deliveryDetails:
 *                 type: array
 *                 description: List of delivery details for the deal
 *                 items:
 *                   type: object
 *                 example: [{deliveryDetails: delivery details text, deliveryDate: 2024-12-31}, {deliveryDetails: delivery details text, deliveryDate: 2024-12-31}]
 *               invoiceDetails:
 *                 type: array
 *                 description: List of invoice details for the deal
 *                 items:
 *                   type: object
 *                 example: [{invoiceNumber: xas21dsadawa, amount: 5000}, {invoiceNumber: xas21dsadawa, amount: 2000, collected: true, collectedDate: 2024-12-31}]
 *     responses:
 *       201:
 *         description: deal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the deal
 *                   example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *                 name:
 *                   type: string
 *                   description: Name of the deal
 *                   example: New Business deal
 *                 stage:
 *                   type: string
 *                   description: Current stage of the deal
 *                   example: PROGRESS
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/convert-lead',
  authenticateUser,
  HasPermission([DealPermissionsEnum.CREATE_DEALS]),
  validateBody(ConvertLeadToDealInput),
  dealController.convertLead
);

/**
 * @swagger
 * /api/deal/update:
 *   post:
 *     summary: update Deal
 *     description: update deal with the provided fields. Requires authentication.
 *     tags: [Deal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealId:
 *                 type: string
 *                 description: ID of the deal
 *                 format: uuid
 *                 example: c4e4bcf8-7e9c-4ed9-8e80-32e7eec1dbe6
 *               stage:
 *                 type: string
 *                 description: Stage of the deal
 *                 enum:
 *                   - PROGRESS
 *                   - CANCELLED
 *                   - CLOSED
 *                 example: PROGRESS
 *               userId:
 *                 type: integer
 *                 description: ID of the user that admin want to assign to the deal
 *                 example: 1
 *               companyName:
 *                 type: string
 *                 description: Name of the company
 *                 maxLength: 100
 *                 example: Company Business name
 *               price:
 *                 type: integer
 *                 description: deal price
 *                 example: 2000
 *               contractType:
 *                 type: string
 *                 description: contract type of the deal
 *                 enum:
 *                   - Contract
 *                   - PurchaseOrder
 *                 example: Contract
 *               cancelledReason:
 *                 type: string
 *                 description: Reason for cancellation
 *                 required: false
 *               signatureDate:
 *                 type: string
 *                 format: date
 *                 description: signature Date of the deal
 *                 example: 2024-12-31
 *               deliveryDetails:
 *                 type: array
 *                 description: List of delivery details for the deal
 *                 items:
 *                   type: object
 *                 example: [{deliveryDetails: delivery details text, deliveryDate: 2024-12-31}, {deliveryDetails: delivery details text, deliveryDate: 2024-12-31}]
 *               invoiceDetails:
 *                 type: array
 *                 description: List of invoice details for the deal
 *                 items:
 *                   type: object
 *                 example: [{invoiceNumber: xas21dsadawa, amount: 5000}, {invoiceNumber: xas21dsadawa, amount: 2000, collected: true, collectedDate: 2024-12-31}]
 *               deletedInvoiceIds:
 *                 type: array
 *                 description: List of deleted invoice details ids
 *                 items:
 *                   type: number
 *                 example: [1,2,4]
 *               deletedDeliveryIds:
 *                 type: array
 *                 description: List of deleted delivery details ids
 *                 items:
 *                   type: number
 *                 example: [1,2,4]
 *     responses:
 *       201:
 *         description: deal created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dealId:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the deal
 *                   example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *                 clientId:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the client
 *                   example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *                 name:
 *                   type: string
 *                   description: Name of the deal
 *                   example: New Business deal
 *                 stage:
 *                   type: string
 *                   description: Current stage of the deal
 *                   enum:
 *                   - PROGRESS
 *                   - CANCELLED
 *                   - CLOSED
 *                   example: PROGRESS
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/update', authenticateUser, HasPermission([DealPermissionsEnum.EDIT_DEALS]), validateBody(UpdateDealInput), dealController.updateDeal);

//** --------------------- PUT --------------------- */

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/deal/:
 *   get:
 *     summary: Get all deals
 *     tags: [Deal]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         description: Search key for filtering Deals
 *       - in: query
 *         name: stage
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "PROGRESS"
 *               - "CANCELLED"
 *               - "CLOSED"
 *         description: Filter Deals by one or more stage
 *       - in: query
 *         name: contractType
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "Contract"
 *               - "PurchaseOrder"
 *         description: Filter Deals by one or more contract type
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
 *             - "stage"
 *             - "price"
 *             - "contractType"
 *             - "signatureDate"
 *             - "createdAt"
 *         description: Filter leads by one or more sources
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter deals by one or more user IDs
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter leads created after this date (ISO 8601 format)
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter leads created before this date (ISO 8601 format) after this date (ISO 8601 format)
 *       - in: query
 *         name: fromPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter Deals price after this pice (ISO 8601 format)
 *       - in: query
 *         name: toPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter Deals pice before this pice (ISO 8601 format)
 *     responses:
 *       200:
 *         description: List of Deals
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([DealPermissionsEnum.VIEW_GLOBAL_DEALS, DealPermissionsEnum.VIEW_OWN_DEALS]),
  validateQuery(GetPaginatedDealsInput),
  dealController.getDeals
);

/**
 * @swagger
 * /api/deal/excel/{email}:
 *   get:
 *     summary: Send filtered deals as an Excel file to the specified email
 *     tags: [Deal]
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
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         description: Search key for filtering Deals
 *       - in: query
 *         name: stage
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "PROGRESS"
 *               - "CANCELLED"
 *               - "CLOSED"
 *         description: Filter Deals by one or more stage
 *       - in: query
 *         name: contractType
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "Contract"
 *               - "PurchaseOrder"
 *         description: Filter Deals by one or more contract type
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
 *             - "stage"
 *             - "price"
 *             - "contractType"
 *             - "signatureDate"
 *             - "createdAt"
 *         description: Sort field
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter deals by one or more user IDs
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter deals created after this date
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter deals created before this date
 *       - in: query
 *         name: fromPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter deals by price greater than or equal to this value
 *       - in: query
 *         name: toPrice
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter deals by price less than or equal to this value
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
  HasPermission([DealPermissionsEnum.VIEW_GLOBAL_DEALS, DealPermissionsEnum.VIEW_OWN_DEALS]),
  validateQuery(GetPaginatedDealsInput),
  dealController.sendDealsExcelByEmail
);

/**
 * @swagger
 * /api/deal/{id}:
 *   get:
 *     summary: Get a single deal by ID
 *     tags: [Deal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the Deal to retrieve
 *     responses:
 *       200:
 *         description: Deal found
 *       404:
 *         description: Deal not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([DealPermissionsEnum.VIEW_GLOBAL_DEALS, DealPermissionsEnum.VIEW_OWN_DEALS]),
  dealController.getDealById
);
//** --------------------- DELETE --------------------- */

export default router;
