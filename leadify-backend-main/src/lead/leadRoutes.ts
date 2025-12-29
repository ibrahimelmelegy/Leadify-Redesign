import express from 'express';
import leadController from './leadController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateLeadInput } from './inputs/createLeadInput'; // DTO for body validation
import { UpdateLeadInput } from './inputs/updateLeadInput';
import { GetLeadsInput } from './inputs/getLeadsInput';
import { LeadPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */

/**
 * @swagger
 * /api/lead/:
 *   post:
 *     summary: Create new lead
 *     description: Create a new lead with the provided details. Requires authentication.
 *     tags: [Lead]
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
 *                 description: Name of the lead
 *                 maxLength: 100
 *                 example: John Doe
 *               companyName:
 *                 type: string
 *                 description: Name of the company
 *                 maxLength: 100
 *                 example: ABC Corp
 *               email:
 *                 type: string
 *                 description: Email address of the lead
 *                 maxLength: 100
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 description: Phone number of the lead (international format)
 *                 maxLength: 15
 *                 example: +1234567890
 *               leadSource:
 *                 type: string
 *                 description: Source of the lead
 *                 enum:
 *                   - REFERRAL
 *                   - WEBSITE
 *                   - EVENT
 *                   - EMAIL
 *                   - OTHER
 *                 example: WEBSITE
 *               otherSource:
 *                 type: string
 *                 maxLength: 100
 *               userId:
 *                 type: integer
 *                 description: ID of the user assigned to the lead
 *                 example: 1
 *               notes:
 *                 type: string
 *                 description: Additional notes about the lead
 *                 maxLength: 2000
 *                 example: This lead was referred by a mutual contact.
 *               status:
 *                 type: string
 *                 description: Current status of the lead
 *                 enum:
 *                   - NEW
 *                   - CONTACTED
 *                   - QUALIFIED
 *                   - DISQUALIFIED
 *                 example: NEW
 *               lastContactDate:
 *                 type: string
 *                 format: date
 *                 description: Last Contact date of the lead
 *                 example: 2024-12-31
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the lead
 *                   example: c4e4bcf8-7e9c-4ed9-8e80-32e7eec1dbe6
 *                 name:
 *                   type: string
 *                   description: Name of the lead
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

router.post('/', authenticateUser, HasPermission([LeadPermissionsEnum.CREATE_LEADS]), validateBody(CreateLeadInput), leadController.createLead);

/**
 **
 * @swagger
 * /api/lead/import:
 *   post:
 *     summary: import lead
 *     description: Import  lead from file. Requires authentication.
 *     tags: [Lead]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lead updated successfully
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
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lead not found
 *       500:
 *         description: Internal server error
 */
router.post(
  '/import',
  authenticateUser,
  HasPermission([LeadPermissionsEnum.CREATE_LEADS]),
  validateBody(UpdateLeadInput),
  leadController.importLeadSheet
);
//** --------------------- PUT --------------------- */

/**
 * @swagger
 * /api/lead/{id}:
 *   put:
 *     summary: Update lead
 *     description: Updates an existing lead based on the provided fields. Requires authentication.
 *     tags: [Lead]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lead to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Lead name
 *                 maxLength: 100
 *               companyName:
 *                 type: string
 *                 description: Company name
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 description: Valid email address
 *                 maxLength: 100
 *               phone:
 *                 type: string
 *                 description: Valid international phone number format (e.g., +1234567890)
 *                 maxLength: 15
 *               leadSource:
 *                 type: string
 *                 description: Source of the lead
 *               otherSource:
 *                 type: string
 *                 maxLength: 100
 *                 enum:
 *                   - REFERRAL
 *                   - WEBSITE
 *                   - EVENT
 *                   - EMAIL
 *                   - OTHER
 *               userId:
 *                 type: integer
 *                 description: ID of the assigned user
 *               notes:
 *                 type: string
 *                 description: Additional notes for the lead
 *                 maxLength: 2000
 *               status:
 *                 type: string
 *                 description: Current status of the lead
 *                 enum:
 *                   - NEW
 *                   - CONTACTED
 *                   - QUALIFIED
 *                   - DISQUALIFIED
 *               lastContactDate:
 *                 type: string
 *                 format: date
 *                 description: Last Contact date of the lead
 *                 example: 2024-12-31
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lead updated successfully
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
 *         description: Lead not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lead not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateUser, HasPermission([LeadPermissionsEnum.EDIT_LEADS]), validateBody(UpdateLeadInput), leadController.updateLead);

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/lead/:
 *   get:
 *     summary: Get all leads
 *     tags: [Lead]
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
 *         description: Search key for filtering leads
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "NEW"
 *               - "CONTACTED"
 *               - "QUALIFIED"
 *               - "DISQUALIFIED"
 *         description: Filter leads by one or more statuses
 *       - in: query
 *         name: leadSource
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "REFERRAL"
 *               - "WEBSITE"
 *               - "EVENT"
 *               - "EMAIL"
 *               - "OTHER"
 *         description: Filter leads by one or more sources
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter leads by one or more user IDs
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
 *         description: Filter leads created before this date (ISO 8601 format)
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
 *             - "leadSource"
 *             - "status"
 *             - "createdAt"
 *       - in: query
 *         name: fromLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter leads fromLastContactDate after this date (ISO 8601 format)
 *       - in: query
 *         name: toLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter leads toLastContactDate before this date (ISO 8601 format)
 *     responses:
 *       200:
 *         description: List of leads
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get(
  '/',
  authenticateUser,
  HasPermission([LeadPermissionsEnum.VIEW_GLOBAL_LEADS, LeadPermissionsEnum.VIEW_OWN_LEADS]),
  validateQuery(GetLeadsInput),
  leadController.getLeads
);

/**
 * @swagger
 * /api/lead/excel/{email}:
 *   get:
 *     summary: Send leads data as Excel to the specified email
 *     tags: [Lead]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Recipient email address to send the Excel file to
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [NEW, CONTACTED, QUALIFIED, DISQUALIFIED]
 *       - in: query
 *         name: leadSource
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [REFERRAL, WEBSITE, EVENT, EMAIL, OTHER]
 *       - in: query
 *         name: userId
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fromLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toLastContactDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
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
  HasPermission([LeadPermissionsEnum.VIEW_GLOBAL_LEADS, LeadPermissionsEnum.VIEW_OWN_LEADS]),
  validateQuery(GetLeadsInput),
  leadController.sendLeadsExcelByEmail
);

/**
 * @swagger
 * /api/lead/{id}:
 *   get:
 *     summary: Get a single leads by ID
 *     tags: [Lead]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the leads to retrieve
 *     responses:
 *       200:
 *         description: Lead found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([LeadPermissionsEnum.VIEW_GLOBAL_LEADS, LeadPermissionsEnum.VIEW_OWN_LEADS]),
  leadController.leadById
);

//** --------------------- DELETE --------------------- */

export default router;
