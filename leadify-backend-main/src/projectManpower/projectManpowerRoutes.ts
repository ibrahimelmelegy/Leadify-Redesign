import express from 'express';
import projectManpowerController from './projectManpowerController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateProjectManpowerInput } from './inputs/createProjectManpowerInput';
import { UpdateProjectManpowerInput } from './inputs/updateProjectManpowerInput';
import { GetProjectManpowersInput } from './inputs/getProjectManpowersInput';
import { ProjectPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/project-manpower/:
 *   post:
 *     summary: Create a new ProjectManpower
 *     description: Associates manpower with a project including additional fields.
 *     tags: [ProjectManpower]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project
 *               manpowerId:
 *                 type: string
 *                 description: ID of the manpower
 *               estimatedWorkDays:
 *                 type: integer
 *                 description: Number of days the manpower is expected to work
 *               actualWorkDays:
 *                 type: integer
 *                 description: Number of days the manpower is actual to work
 *               mission:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of missions
 *               otherCosts:
 *                 type: number
 *                 format: float
 *                 description: Additional costs
 *               otherCostsReason:
 *                 type: string
 *                 description: Reason for other costs
 *     responses:
 *       201:
 *         description: ProjectManpower created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.CREATE_PROJECTS]),
  validateBody(CreateProjectManpowerInput),
  projectManpowerController.createProjectManpower
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/project-manpower/{id}:
 *   put:
 *     summary: Update ProjectManpower
 *     description: Updates an existing project manpower entry.
 *     tags: [ProjectManpower]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProjectManpower to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: ID of the project
 *               manpowerId:
 *                 type: string
 *                 description: ID of the manpower
 *               estimatedWorkDays:
 *                 type: integer
 *                 description: Number of days the manpower is expected to work
 *               actualWorkDays:
 *                 type: integer
 *                 description: Number of days the manpower is actual to work
 *               mission:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of missions
 *               otherCosts:
 *                 type: number
 *                 format: float
 *                 description: Additional costs
 *               otherCostsReason:
 *                 type: string
 *                 description: Reason for other costs
 *     responses:
 *       200:
 *         description: ProjectManpower updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: ProjectManpower not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(UpdateProjectManpowerInput),
  projectManpowerController.updateProjectManpower
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/project-manpower/:
 *   get:
 *     summary: Get all ProjectManpower records
 *     tags: [ProjectManpower]
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
 *         name: projectId
 *         required: false
 *         schema:
 *           type: string
 *         description: The id of the project to filter
 *     responses:
 *       200:
 *         description: List of ProjectManpower records
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  validateQuery(GetProjectManpowersInput),
  projectManpowerController.getProjectManpowers
);

/**
 * @swagger
 * /api/project-manpower/{id}:
 *   get:
 *     summary: Get a single ProjectManpower by ID
 *     tags: [ProjectManpower]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProjectManpower to retrieve
 *     responses:
 *       200:
 *         description: ProjectManpower found
 *       404:
 *         description: ProjectManpower not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  projectManpowerController.projectManpowerById
);

//** --------------------- DELETE --------------------- */

/**
 * @swagger
 * /api/project-manpower/{id}:
 *   delete:
 *     summary: Delete ProjectManpower
 *     description: Deletes a ProjectManpower record by ID.
 *     tags: [ProjectManpower]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ProjectManpower to delete
 *     responses:
 *       200:
 *         description: ProjectManpower deleted successfully
 *       404:
 *         description: ProjectManpower not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]), projectManpowerController.deleteProjectManpower);

export default router;
