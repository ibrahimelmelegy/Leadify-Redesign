import express from 'express';
import proposalLogController from './proposalLogController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateQuery } from '../middleware/validation';
import { GetProposalLogsInput } from './inputs/getProposalLogsInput';
import { ProposalPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

// ** --------------------- PUT --------------------- **/
/**
 * @swagger
 * /api/proposal-log/:
 *   get:
 *     summary: Get all ProposalFinanceTableItems
 *     tags: [ProposalFinanceTableItem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: proposalId
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: List of ProposalFinanceTableItems
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProposalPermissionsEnum.VIEW_OWN_PROPOSALS, ProposalPermissionsEnum.VIEW_GLOBAL_PROPOSALS]),
  validateQuery(GetProposalLogsInput),
  proposalLogController.getProposalLogs
);
// ** --------------------- GET --------------------- **/

//** --------------------- DELETE --------------------- */

export default router;
