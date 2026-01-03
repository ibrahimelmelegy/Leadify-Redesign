import express from 'express';
import proposalFinanceTableItemController from './proposalFinanceTableItemController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateProposalFinanceTableItemInput } from './inputs/createProposalFinanceTableItemInput';
import { UpdateProposalFinanceTableItemInput } from './inputs/updateProposalFinanceTableItemInput';
import { GetProposalFinanceTableItemsInput } from './inputs/getProposalFinanceTableItemsInput';
import { ProposalPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table-item/:
 *   post:
 *     summary: Create a new ProposalFinanceTableItem
 *     description: Adds a new item to a proposal finance table.
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               financeTableId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the proposal finance table
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               materialId:
 *                 type: integer
 *                 description: ID of the material
 *                 example: 10
 *               qty:
 *                 type: integer
 *                 description: Quantity of the item
 *                 example: 5
 *               customColumns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Custom column key
 *                       example: "Additional Info"
 *                     value:
 *                       type: string
 *                       description: Custom column value
 *                       example: "Special discount applied"
 *                     index:
 *                       type: number
 *                       description: number column value
 *                       example: 1
 *     responses:
 *       201:
 *         description: ProposalFinanceTableItem created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(CreateProposalFinanceTableItemInput),
  proposalFinanceTableItemController.createProposalFinanceTableItem
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table-item/{id}:
 *   put:
 *     summary: Update ProposalFinanceTableItem
 *     description: Updates an existing finance table item.
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTableItem to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qty:
 *                 type: integer
 *                 description: Quantity of the item
 *                 example: 5
 *               customColumns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                       description: Custom column key
 *                       example: "Additional Info"
 *                     value:
 *                       type: string
 *                       description: Custom column value
 *                       example: "Special discount applied"
 *                     index:
 *                       type: number
 *                       description: number column value
 *                       example: 1
 *     responses:
 *       200:
 *         description: ProposalFinanceTableItem updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: ProposalFinanceTableItem not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(UpdateProposalFinanceTableItemInput),
  proposalFinanceTableItemController.updateProposalFinanceTableItem
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table-item/:
 *   get:
 *     summary: Get all ProposalFinanceTableItems
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
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
 *         description: Search key for filtering assets
 *       - in: query
 *         name: financeTableId
 *         required: false
 *         schema:
 *           type: string
 *         description: The id of the financeTableId to filter
 *     responses:
 *       200:
 *         description: List of ProposalFinanceTableItems
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS, ProposalPermissionsEnum.VIEW_OWN_PROPOSALS]),
  validateQuery(GetProposalFinanceTableItemsInput),
  proposalFinanceTableItemController.getProposalFinanceTableItems
);

/**
 * @swagger
 * /api/proposal-finance-table-item/{id}:
 *   get:
 *     summary: Get a single ProposalFinanceTableItem by ID
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTableItem to retrieve
 *     responses:
 *       200:
 *         description: ProposalFinanceTableItem found
 *       404:
 *         description: ProposalFinanceTableItem not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS, ProposalPermissionsEnum.VIEW_OWN_PROPOSALS]),
  proposalFinanceTableItemController.proposalFinanceTableItemById
);

//** --------------------- DELETE --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table-item/{id}:
 *   delete:
 *     summary: Delete ProposalFinanceTableItem
 *     description: Deletes a ProposalFinanceTableItem record by ID.
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTableItem to delete
 *     responses:
 *       200:
 *         description: ProposalFinanceTableItem deleted successfully
 *       404:
 *         description: ProposalFinanceTableItem not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  proposalFinanceTableItemController.deleteProposalFinanceTableItem
);

export default router;
