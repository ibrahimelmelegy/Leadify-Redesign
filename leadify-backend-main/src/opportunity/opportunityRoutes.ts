import express from 'express';
import opportunityController from './opportunityController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { UpdateOpportunityInput } from './inputs/updateOpportunityInput';
import { GetOpportunitiesInput } from './inputs/getOpportunitiesInput';
import { ConvertLeadToOpportunityInput } from './inputs/convertLeadToOpportunityInput';
import { CreateLeadAndOpportunityInput } from './inputs/createOpportunityInput';
import { OpportunityPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */
/**
 * @swagger
 * /api/opportunity/:
 *   post:
 *     summary: Create Lead and Opportunity
 *     description: Create a lead and opportunity with the provided details. Requires authentication.
 *     tags: [Opportunity]
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
 *                   - users
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
 *                   users:
 *                     type: array
 *                     description: List of user IDs assigned to the lead
 *                     items:
 *                       type: integer
 *                     example: [1]
 *               opportunity:
 *                 type: object
 *                 required:
 *                   - users
 *                   - name
 *                   - stage
 *                 properties:
 *                   users:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     description: List of user IDs assigned to the proposal
 *                     example: [1, 2]
 *                   name:
 *                     type: string
 *                     description: Name of the opportunity
 *                     maxLength: 100
 *                     example: New Business Opportunity
 *                   interestedIn:
 *                     type: string
 *                     description: Details of what the lead is interested in
 *                     example: Product X demo
 *                   stage:
 *                     type: string
 *                     description: Stage of the opportunity
 *                     enum:
 *                       - DISCOVERY
 *                       - PROPOSAL
 *                       - NEGOTIATION
 *                       - LOST
 *                       - WON
 *                     example: NEGOTIATION
 *                   estimatedValue:
 *                     type: integer
 *                     description: Estimated value of the opportunity
 *                     example: 5000
 *                   profit:
 *                     type: integer
 *                     description: profit value of the opportunity
 *                     example: 5000
 *                   expectedCloseDate:
 *                     type: string
 *                     format: date
 *                     description: Expected close date of the opportunity
 *                     example: 2024-12-31
 *                   priority:
 *                     type: string
 *                     description: Priority of the opportunity
 *                     enum:
 *                       - VERY_HIGH
 *                       - HIGH
 *                       - MEDIUM
 *                       - LOW
 *                       - VERY_LOW
 *                     example: HIGH
 *                   nextSteps:
 *                     type: array
 *                     description: List of next steps for the opportunity
 *                     items:
 *                       type: string
 *                     example: ["Follow up call", "Send proposal"]
 *                   reasonOfLose:
 *                     type: string
 *                     description: Reason the opportunity was lost (only for LOST stage opportunities)
 *                     example: Not enough budget
 *                   notes:
 *                     type: string
 *                     description: Additional notes about the lead
 *                     maxLength: 2000
 *                     example: This lead was referred by a mutual contact
 *               clientId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated client (optional if lead is new)
 *                 example: c4e4bcf8-7e9c-4ed9-8e80-32e7eec1dbe6
 *     responses:
 *       201:
 *         description: Lead and Opportunity created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post(
  '/',
  authenticateUser,
  HasPermission([OpportunityPermissionsEnum.CREATE_OPPORTUNITIES]),
  validateBody(CreateLeadAndOpportunityInput),
  opportunityController.createOpportunity
);

/**
 * @swagger
 * /api/opportunity/convert-lead:
 *   post:
 *     summary: Convert lead to opportunity
 *     description: Convert lead to opportunity with the provided details. Requires authentication.
 *     tags: [Opportunity]
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
 *                 description: ID of the lead associated with the opportunity
 *                 format: uuid
 *                 example: c4e4bcf8-7e9c-4ed9-8e80-32e7eec1dbe6
 *               users:
 *                 type: array
 *                 description: List of user IDs assigned to the opportunity
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               name:
 *                 type: string
 *                 description: Name of the opportunity
 *                 maxLength: 100
 *                 example: New Business Opportunity
 *               interestedIn:
 *                 type: string
 *                 description: Details of what the lead is interested in
 *                 example: Product X demo
 *               stage:
 *                 type: string
 *                 description: Stage of the opportunity
 *                 enum:
 *                   - DISCOVERY
 *                   - PROPOSAL
 *                   - NEGOTIATION
 *                   - WON
 *                   - LOST
 *                 example: NEGOTIATION
 *               estimatedValue:
 *                 type: integer
 *                 description: Estimated value of the opportunity
 *                 example: 5000
 *               profit:
 *                 type: integer
 *                 description: profit value of the opportunity
 *                 example: 5000
 *               expectedCloseDate:
 *                 type: string
 *                 format: date
 *                 description: Expected close date of the opportunity
 *                 example: 2024-12-31
 *               priority:
 *                 type: string
 *                 description: Priority of the opportunity
 *                 enum:
 *                   - VERY_HIGH
 *                   - HIGH
 *                   - MEDIUM
 *                   - LOW
 *                   - VERY_LOW
 *                 example: HIGH
 *               nextSteps:
 *                 type: array
 *                 description: List of next steps for the opportunity
 *                 items:
 *                   type: string
 *                 example: ["Follow up call", "Send proposal"]
 *               reasonOfLose:
 *                 type: string
 *                 description: Reason the opportunity was lost (only for LOST opportunities)
 *                 example: Not enough budget
 *               notes:
 *                 type: string
 *                 description: Additional notes about the lead
 *                 maxLength: 2000
 *                 example: This lead was referred by a mutual contact.
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Unique identifier of the opportunity
 *                   example: b9c4bcf8-7e9c-4ed9-8e80-32e7eec1dbe7
 *                 name:
 *                   type: string
 *                   description: Name of the opportunity
 *                   example: New Business Opportunity
 *                 stage:
 *                   type: string
 *                   description: Current stage of the opportunity
 *                   example: QUALIFIED
 *                 estimatedValue:
 *                   type: integer
 *                   description: Estimated value of the opportunity
 *                   example: 5000
 *                 profit:
 *                   type: integer
 *                   description: profit value of the opportunity
 *                   example: 5000
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/convert-lead',
  authenticateUser,
  HasPermission([OpportunityPermissionsEnum.CREATE_OPPORTUNITIES]),
  validateBody(ConvertLeadToOpportunityInput),
  opportunityController.convertLeadToOpportunity
);

//** --------------------- PUT --------------------- */

/**
 * @swagger
 * /api/opportunity/{id}:
 *   put:
 *     summary: Update opportunity
 *     description: Updates an existing opportunity based on the provided fields. Requires authentication.
 *     tags: [Opportunity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the opportunity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 description: List of user IDs assigned to the opportunity
 *                 items:
 *                   type: integer
 *                 example: [1]
 *               name:
 *                 type: string
 *                 description: Name of the opportunity
 *                 maxLength: 100
 *                 example: New Business Opportunity
 *               interestedIn:
 *                 type: string
 *                 description: Details of what the lead is interested in
 *                 example: Product X demo
 *               stage:
 *                 type: string
 *                 description: Stage of the opportunity
 *                 enum:
 *                   - DISCOVERY
 *                   - PROPOSAL
 *                   - NEGOTIATION
 *                   - WON
 *                   - LOST
 *                 example: NEGOTIATION
 *               estimatedValue:
 *                 type: integer
 *                 description: Estimated value of the opportunity
 *                 example: 5000
 *               profit:
 *                 type: integer
 *                 description: profit value of the opportunity
 *                 example: 5000
 *               expectedCloseDate:
 *                 type: string
 *                 format: date
 *                 description: Expected close date of the opportunity
 *                 example: 2024-12-31
 *               priority:
 *                 type: string
 *                 description: Priority of the opportunity
 *                 enum:
 *                   - VERY_HIGH
 *                   - HIGH
 *                   - MEDIUM
 *                   - LOW
 *                   - VERY_LOW
 *                 example: HIGH
 *               nextSteps:
 *                 type: array
 *                 description: List of next steps for the opportunity
 *                 items:
 *                   type: string
 *                 example: ["Follow up call", "Send proposal"]
 *               reasonOfLose:
 *                 type: string
 *                 description: Reason the opportunity was lost (only for LOST opportunities)
 *                 example: Not enough budget
 *               notes:
 *                 type: string
 *                 description: Additional notes about the lead
 *                 maxLength: 2000
 *                 example: This lead was referred by a mutual contact.
 *               clientId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Opportunity updated successfully
 *       400:
 *         description: Validation error
 *       604:
 *         description: Opportunity not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([OpportunityPermissionsEnum.EDIT_OPPORTUNITIES]),
  validateBody(UpdateOpportunityInput),
  opportunityController.updateOpportunity
);

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/opportunity/:
 *   get:
 *     summary: Get all opportunities
 *     tags: [Opportunity]
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
 *       - in: query
 *         name: searchKey
 *         schema:
 *           type: string
 *         description: Search key for filtering opportunities
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *         description: Sort direction
 *         example: "ASC"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - stage
 *             - estimatedValue
 *             - expectedCloseDate
 *             - priority
 *             - createdAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: stage
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - DISCOVERY
 *               - PROPOSAL
 *               - NEGOTIATION
 *               - WON
 *               - LOST
 *         description: Filter opportunities by one or more stages
 *         example: ["DISCOVERY", "WON"]
 *       - in: query
 *         name: userId
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter opportunities by user IDs
 *         example: [1, 2]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - VERY_HIGH
 *               - HIGH
 *               - MEDIUM
 *               - LOW
 *               - VERY_LOW
 *         description: Filter opportunities by priority levels
 *         example: ["HIGH", "MEDIUM"]
 *       - in: query
 *         name: fromExpectedCloseDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter opportunities with expected close date from this value (inclusive)
 *         example: "2024-01-01"
 *       - in: query
 *         name: toExpectedCloseDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter opportunities with expected close date to this value (inclusive)
 *         example: "2024-12-31"
 *       - in: query
 *         name: fromEstimatedValue
 *         schema:
 *           type: integer
 *         description: Filter opportunities with estimated value from this number (inclusive)
 *         example: 1000
 *       - in: query
 *         name: toEstimatedValue
 *         schema:
 *           type: integer
 *         description: Filter opportunities with estimated value to this number (inclusive)
 *         example: 10000
 *       - in: query
 *         name: fromProfit
 *         schema:
 *           type: integer
 *         description: Filter opportunities with profit from this number (inclusive)
 *         example: 1000
 *       - in: query
 *         name: toProfit
 *         schema:
 *           type: integer
 *         description: Filter opportunities with profit to this number (inclusive)
 *         example: 10000
 *     responses:
 *       200:
 *         description: List of opportunities
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES, OpportunityPermissionsEnum.VIEW_OWN_OPPORTUNITIES]),
  validateQuery(GetOpportunitiesInput),
  opportunityController.getOpportunities
);

/**
 * @swagger
 * /api/opportunity/excel/{email}:
 *   get:
 *     summary: Send filtered opportunities as an Excel file to the specified email
 *     tags: [Opportunity]
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
 *         description: Search key for filtering opportunities
 *       - in: query
 *         name: stage
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - DISCOVERY
 *               - PROPOSAL
 *               - NEGOTIATION
 *               - WON
 *               - LOST
 *         description: Filter by one or more stages
 *       - in: query
 *         name: userId
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter by user IDs
 *       - in: query
 *         name: priority
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - VERY_HIGH
 *               - HIGH
 *               - MEDIUM
 *               - LOW
 *               - VERY_LOW
 *         description: Filter by priority levels
 *       - in: query
 *         name: fromExpectedCloseDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Expected close date from (inclusive)
 *       - in: query
 *         name: toExpectedCloseDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Expected close date to (inclusive)
 *       - in: query
 *         name: fromEstimatedValue
 *         schema:
 *           type: integer
 *         description: Estimated value from (inclusive)
 *       - in: query
 *         name: toEstimatedValue
 *         schema:
 *           type: integer
 *         description: Estimated value to (inclusive)
 *       - in: query
 *         name: fromProfit
 *         schema:
 *           type: integer
 *         description: profit from (inclusive)
 *       - in: query
 *         name: toProfit
 *         schema:
 *           type: integer
 *         description: profit to (inclusive)
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
  HasPermission([OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES, OpportunityPermissionsEnum.VIEW_OWN_OPPORTUNITIES]),
  validateQuery(GetOpportunitiesInput),
  opportunityController.sendOpportunitiesExcelByEmail
);

/**
 * @swagger
 * /api/opportunity/{id}:
 *   get:
 *     summary: Get a single opportunity by ID
 *     tags: [Opportunity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the opportunity to retrieve
 *     responses:
 *       200:
 *         description: Opportunity found
 *       604:
 *         description: Opportunity not found
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([OpportunityPermissionsEnum.VIEW_GLOBAL_OPPORTUNITIES, OpportunityPermissionsEnum.VIEW_OWN_OPPORTUNITIES]),
  opportunityController.opportunityById
);

//** --------------------- DELETE --------------------- */

export default router;
