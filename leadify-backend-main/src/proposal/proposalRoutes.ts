import express, { Request, Response, NextFunction } from 'express';
import proposalController from './proposalController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateProposalInput } from './inputs/createProposalInput';
import { UpdateProposalInput } from './inputs/updateProposalInput';
import { GetProposalsInput } from './inputs/getProposalsInput';
import { RejectProposalInput } from './inputs/rejectProposalInput';
import { AssignUserToProposalInput } from './inputs/assignUsersToProposalInput';
import { ProposalPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/proposal/:
 *   post:
 *     summary: Create new proposal.
 *     description: Create a new proposal with the provided details. Requires authentication.
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               relatedEntityId :
 *                 type: string
 *                 description: ID of the Opportunity, Deal, or Project associated with the proposal.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               relatedEntityType:
 *                 type: string
 *                 enum: ["Project", "Opportunity", "Deal"]
 *                 description: relatedEntityType of the proposal.
 *                 example: "Project"
 *               title:
 *                 type: string
 *                 description: Title of the proposal.
 *                 example: "Proposal for Website Redesign"
 *               version:
 *                 type: string
 *                 description: Version of the proposal (auto-generated for new proposals).
 *                 example: "1.0"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the proposal.
 *                 example: "2023-10-15"
 *               type:
 *                 type: string
 *                 enum: ["FINANCIAL", "TECHNICAL", "MIXED"]
 *                 description: Type of the proposal.
 *                 example: "TECHNICAL"
 *               reference:
 *                 type: string
 *                 description: Unique reference for the proposal.
 *                 maxLength: 50
 *                 example: "PROP-2023-001"
 *               proposalFor:
 *                 type: string
 *                 description: Entity or client the proposal is for.
 *                 maxLength: 100
 *                 example: "Tech Solutions Inc."
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *                 description: Company companyLogo for the proposal.
 *               users:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: List of user IDs assigned to the proposal.
 *                 example: [1, 2]
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Initial remarks or notes regarding the proposal.
 *               fileAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of fileAttachments to the proposal.
 *                 example: ["path1", "path2"]
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Proposal created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.CREATE_PROPOSALS]),
  validateBody(CreateProposalInput),
  proposalController.createProposal
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/proposal/assign-users/{id}:
 *   put:
 *     summary: assign-users to proposal
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: List of user IDs assigned to the proposal.
 *                 example: [1", 2]
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Validation error
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/assign-users/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(AssignUserToProposalInput),
  proposalController.assignUsers
);

/**
 * @swagger
 * /api/proposal/approve/{id}:
 *   put:
 *     summary: approve proposal
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Validation error
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put('/approve/:id', authenticateUser, HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]), proposalController.approveProposal);

/**
 * @swagger
 * /api/proposal/reject/{id}:
 *   put:
 *     summary: Reject proposal
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *                 maxLength: 500
 *                 description: rejectionReason of the proposal.
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Validation error
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/reject/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(RejectProposalInput),
  proposalController.rejectProposal
);

/**
 * @swagger
 * /api/proposal/waiting-approval/{id}:
 *   put:
 *     summary: Waiting approval proposal
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     responses:
 *       200:
 *         description: Proposal updated successfully
 *       400:
 *         description: Validation error
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/waiting-approval/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  proposalController.waitingApprovalProposal
);

/**
 * @swagger
 * /api/proposal/{id}:
 *   put:
 *     summary: Update proposal
 *     description: Updates an existing proposal based on the provided fields. Requires authentication.
 *     tags: [Proposal]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               relatedEntityId :
 *                 type: string
 *                 description: ID of the Opportunity, Deal, or Project associated with the proposal.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               relatedEntityType:
 *                 type: string
 *                 enum: ["Project", "Opportunity", "Deal"]
 *                 description: relatedEntityType of the proposal.
 *                 example: "Project"
 *               title:
 *                 type: string
 *                 description: Title of the proposal.
 *                 example: "Proposal for Website Redesign"
 *               version:
 *                 type: string
 *                 description: Version of the proposal (auto-generated for new proposals).
 *                 example: "1.0"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the proposal.
 *                 example: "2023-10-15"
 *               type:
 *                 type: string
 *                 enum: ["FINANCIAL", "TECHNICAL", "MIXED"]
 *                 description: Type of the proposal.
 *                 example: "TECHNICAL"
 *               reference:
 *                 type: string
 *                 description: Unique reference for the proposal.
 *                 maxLength: 50
 *                 example: "PROP-2023-001"
 *               proposalFor:
 *                 type: string
 *                 description: Entity or client the proposal is for.
 *                 maxLength: 100
 *                 example: "Tech Solutions Inc."
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *                 description: Company companyLogo for the proposal.
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Initial remarks or notes regarding the proposal.
 *               fileAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of fileAttachments to the proposal.
 *                 example: ["path1", "path2"]
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Proposal updated successfully.
 *       400:
 *         description: Validation error
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(UpdateProposalInput),
  proposalController.updateProposal
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/proposal/:
 *   get:
 *     summary: Get all proposals
 *     tags: [Proposal]
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
 *         description: Search key for filtering proposals
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
 *             - title
 *             - version
 *             - proposalDate
 *             - type
 *             - status
 *             - createdAt
 *             - updatedAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "WAITING_APPROVAL"
 *               - "APPROVED"
 *               - "REJECTED"
 *               - "ARCHIVED"
 *         description: Filter proposals by one or more statuses
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "FINANCIAL"
 *               - "TECHNICAL"
 *               - "MIXED"
 *         description: Filter proposals by one or more types
 *       - in: query
 *         name: userId
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         description: Filter proposals by user IDs
 *         example: [1, 2]
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter proposals created after this date (ISO 8601 format)
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter proposals created before this date (ISO 8601 format)
 *       - in: query
 *         name: relatedEntityId
 *         required: false
 *         schema:
 *           type: string
 *         description: The id of the relatedEntity to filter
 *     responses:
 *       200:
 *         description: List of proposals
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  validateQuery(GetProposalsInput),
  proposalController.getProposals
);

/**
 * @swagger
 * /api/proposal/excel/{email}:
 *   get:
 *     summary: Send filtered proposals as an Excel file to the specified email
 *     tags: [Proposal]
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
 *           default: 10
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering proposals
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - title
 *             - version
 *             - proposalDate
 *             - type
 *             - status
 *             - createdAt
 *             - updatedAt
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "WAITING_APPROVAL"
 *               - "APPROVED"
 *               - "REJECTED"
 *               - "ARCHIVED"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               - "FINANCIAL"
 *               - "TECHNICAL"
 *               - "MIXED"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         example: [1, 2]
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
 *         name: relatedEntityId
 *         schema:
 *           type: string
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
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  validateQuery(GetProposalsInput),
  proposalController.sendProposalsExcelByEmail
);

/**
 * @swagger
 * /api/proposal/{id}:
 *   get:
 *     summary: Get a single proposal by ID
 *     tags: [Proposal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the proposal to retrieve
 *     responses:
 *       200:
 *         description: Proposal found
 *       623:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  proposalController.getProposalById
);

export default router;
