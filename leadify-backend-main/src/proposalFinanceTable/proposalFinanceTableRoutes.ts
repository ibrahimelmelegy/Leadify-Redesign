import express from 'express';
import proposalFinanceTableController from './proposalFinanceTableController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateProposalFinanceTableInput } from './inputs/createProposalFinanceTableInput';
import { UpdateProposalFinanceTableInput } from './inputs/updateProposalFinanceTableInput';
import { GetProposalFinanceTablesInput } from './inputs/getProposalFinanceTablesInput';
import { ProposalPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table/:
 *   post:
 *     summary: Create a new ProposalFinanceTable
 *     description: Adds a new finance table for a proposal.
 *     tags: [ProposalFinanceTable]
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
 *               discount:
 *                 type: number
 *                 description: Discount value for the finance table.
 *                 example: 10.5
 *               marginAmount:
 *                 type: number
 *                 description: Margin amount for the finance table.
 *                 example: 100.0
 *               items:
 *                 type: array
 *                 description: List of finance table items.
 *                 items:
 *                   type: object
 *                   properties:
 *                     materialId:
 *                       type: integer
 *                       description: materialId of the item.
 *                       example: 1
 *                     qty:
 *                       type: integer
 *                       description: Quantity of the item.
 *                       example: 2
 *                     customColumns:
 *                       type: array
 *                       description: Custom columns with key-value pairs.
 *                       items:
 *                         type: object
 *                         properties:
 *                           key:
 *                             type: string
 *                             description: Key of the custom column.
 *                             example: "Color"
 *                           value:
 *                             type: string
 *                             description: Value of the custom column.
 *                             example: "Blue"
 *                           index:
 *                             type: number
 *                             description: index of the custom column.
 *                             example: 1
 *     responses:
 *       201:
 *         description: ProposalFinanceTable created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(CreateProposalFinanceTableInput),
  proposalFinanceTableController.createFinanceTable
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table/{id}:
 *   put:
 *     summary: Update ProposalFinanceTable
 *     description: Updates an existing finance table.
 *     tags: [ProposalFinanceTable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTable to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *                 description: Discount value for the finance table.
 *                 example: 10.5
 *               marginAmount:
 *                 type: number
 *                 description: Margin amount for the finance table.
 *                 example: 100.0
 *     responses:
 *       200:
 *         description: ProposalFinanceTable updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: ProposalFinanceTable not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  validateBody(UpdateProposalFinanceTableInput),
  proposalFinanceTableController.updateFinanceTable
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table/:
 *   get:
 *     summary: Get all ProposalFinanceTables
 *     tags: [ProposalFinanceTable]
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
 *         description: Search key for filtering
 *       - in: query
 *         name: proposalId
 *         required: false
 *         schema:
 *           type: string
 *         description: The id of the proposalId to filter
 *     responses:
 *       200:
 *         description: List of ProposalFinanceTables
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  validateQuery(GetProposalFinanceTablesInput),
  proposalFinanceTableController.getFinanceTables
);

/**
 * @swagger
 * /api/proposal-finance-table/{id}:
 *   get:
 *     summary: Get a single ProposalFinanceTable by ID
 *     tags: [ProposalFinanceTable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTable to retrieve
 *     responses:
 *       200:
 *         description: ProposalFinanceTable found
 *       404:
 *         description: ProposalFinanceTable not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  proposalFinanceTableController.financeTableById
);

//** --------------------- DELETE --------------------- **/

/**
 * @swagger
 * /api/proposal-finance-table/{id}/{customColumnKey}:
 *   delete:
 *     summary: Delete ProposalFinanceTable custom Column
 *     description: Deletes a ProposalFinanceTable custom Column record by ID.
 *     tags: [ProposalFinanceTable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTable to delete custom Column
 *       - in: path
 *         name: customColumnKey
 *         required: true
 *         schema:
 *           type: string
 *         description: The customColumn of the ProposalFinanceTable to delete
 *     responses:
 *       200:
 *         description: ProposalFinanceTable customColumn deleted successfully
 *       404:
 *         description: ProposalFinanceTable not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:id/:customColumnKey',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]),
  proposalFinanceTableController.deleteFinanceTableCustomColumn
);

/**
 * @swagger
 * /api/proposal-finance-table/{id}:
 *   delete:
 *     summary: Delete ProposalFinanceTable
 *     description: Deletes a ProposalFinanceTable record by ID.
 *     tags: [ProposalFinanceTable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProposalFinanceTable to delete
 *     responses:
 *       200:
 *         description: ProposalFinanceTable deleted successfully
 *       404:
 *         description: ProposalFinanceTable not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, HasPermission([ProposalPermissionsEnum.EDIT_PROPOSALS]), proposalFinanceTableController.deleteFinanceTable);

export default router;
