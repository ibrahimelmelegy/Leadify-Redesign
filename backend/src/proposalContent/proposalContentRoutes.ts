import express from 'express';
import proposalContentController from './proposalContentController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import { CreateProposalContentInput } from './inputs/createProposalContentInput';
import { UpdateProposalContentInput } from './inputs/updateProposalContentInput';
import { ProposalPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/proposal-content/:
 *   post:
 *     summary: Create new proposal content.
 *     description: Create a new proposal content entry for an existing proposal. Requires authentication.
 *     tags: [Proposal Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposalId:
 *                 type: string
 *                 description: ID of the related proposal.
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               parentId:
 *                 type: string
 *                 description: ID of the related content.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               title:
 *                 type: string
 *                 description: Title of the content.
 *                 example: "Introduction Section"
 *               subtitle:
 *                 type: string
 *                 description: Subtitle of the content.
 *                 example: "Overview"
 *               description:
 *                 type: string
 *                 description: Detailed description or text content.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image associated with the content.
 *               financeTable:
 *                 type: object
 *                 description: Financial table data for the proposal.
 *                 properties:
 *                   discount:
 *                     type: number
 *                     description: Discount value for the finance table.
 *                     example: 10.5
 *                   marginAmount:
 *                     type: number
 *                     description: Margin amount for the finance table.
 *                     example: 100.0
 *                   items:
 *                     type: array
 *                     description: List of finance table items.
 *                     items:
 *                       type: object
 *                       properties:
 *                         financeTableId:
 *                           type: string
 *                           description: ID of the related finance table.
 *                           example: "123e4567-e89b-12d3-a456-426614174001"
 *                         materialId:
 *                           type: integer
 *                           description: materialId of the item.
 *                           example: 1
 *                         qty:
 *                           type: integer
 *                           description: Quantity of the item.
 *                           example: 2
 *                         customColumns:
 *                           type: array
 *                           description: Custom columns with key-value pairs.
 *                           items:
 *                             type: object
 *                             properties:
 *                               key:
 *                                 type: string
 *                                 description: Key of the custom column.
 *                                 example: "Color"
 *                               value:
 *                                 type: string
 *                                 description: Value of the custom column.
 *                                 example: "Blue"
 *                               index:
 *                                 type: number
 *                                 description: index of the custom column.
 *                                 example: 0
 *     responses:
 *       201:
 *         description: Proposal content created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(CreateProposalContentInput),
  proposalContentController.createProposalContent
);

// ** --------------------- PUT --------------------- **/
/**
 * @swagger
 * /api/proposal-content/{id}:
 *   put:
 *     summary: Update proposal content.
 *     description: Update proposal content entry for an existing proposal. Requires authentication.
 *     tags: [Proposal Content]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               parentId:
 *                 type: string
 *                 description: ID of the related content.
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               title:
 *                 type: string
 *                 description: Title of the content.
 *                 example: "Introduction Section"
 *               subtitle:
 *                 type: string
 *                 description: Subtitle of the content.
 *                 example: "Overview"
 *               description:
 *                 type: string
 *                 description: Detailed description or text content.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image associated with the content.
 *     responses:
 *       200:
 *         description: Proposal content updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(UpdateProposalContentInput),
  proposalContentController.updateProposalContent
);

// ** --------------------- GET --------------------- **/

//** --------------------- DELETE --------------------- */

/**
 * @swagger
 * /api/proposal-content/{id}:
 *   delete:
 *     summary: Delete proposal content.
 *     tags: [Proposal Content]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proposal content deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateUser, HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]), proposalContentController.deleteProposalContent);

export default router;
