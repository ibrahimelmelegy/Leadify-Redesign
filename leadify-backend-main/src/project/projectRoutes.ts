import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { AssociatingAssetToProjectInput } from './inputs/associatingAssetInput';
import { AssociatingManpowerToProjectInput } from './inputs/associatingManpowerInput';
import { completeProjectCreationInput } from './inputs/completeProjectCreationInput';
import { CreateProjectInput } from './inputs/create-project.input';
import { GetProjectsInput } from './inputs/getProjectsInput';
import projectController from './projectController';
import { AssociatingVehiclesToProjectInput } from './inputs/associatingVehiclesInput';
import { AssociatingMaterialsToProjectInput } from './inputs/associatingMaterialsInput';
import { ProjectPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/project/create:
 *   post:
 *     summary: create project
 *     description: create project.
 *     tags: [Project]
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
 *                 required: false
 *                 example: 1c1b4f37-148b-4997-ab24-3ea476517037
 *               basicInfo:
 *                 type: object
 *                 properties:
 *                   leadId:
 *                     type: string
 *                     format: uuid
 *                   dealId:
 *                     type: string
 *                     format: uuid
 *                   opportunityId:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                     maxLength: 255
 *                   type:
 *                     type: string
 *                   category:
 *                     type: string
 *                     enum: ["Direct", "Etimad"]
 *                   clientId:
 *                     type: string
 *                     format: uuid
 *                   files:
 *                     type: array
 *                     items:
 *                      type : object
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   duration:
 *                     type: integer
 *                     minimum: 1
 *                   status:
 *                     type: string
 *                     enum: ["ACTIVE", "CANCELLED","COMPLETE","ON_HOLD"]
 *                   cancelledReason:
 *                     type: string
 *                     maxLength: 255
 *                   assignedUsersIds:
 *                     type: array
 *                     items:
 *                       type: integer
 *                     minItems: 1
 *                   description:
 *                     type: string
 *                     maxLength: 500
 *                   materialMargin:
 *                     type: number
 *                     max: 100
 *                     example: 80
 *                   etimadInfo:
 *                     type: object
 *                     properties:
 *                       abbreviation:
 *                         type: string
 *                         maxLength: 255
 *                       organizationName:
 *                         type: string
 *                         maxLength: 255
 *                       rfpName:
 *                         type: string
 *                         maxLength: 255
 *                       contractType:
 *                         type: string
 *                         enum: ["Fixed", "Variable"]
 *                       tenderPrice:
 *                         type: number
 *                       businessLine:
 *                         type: string
 *                         maxLength: 255
 *                       estimatedBudget:
 *                         type: number
 *                       companyMargin:
 *                         type: number
 *                         minimum: 0
 *                         maximum: 100
 *                       submissionDate:
 *                         type: string
 *                         format: date-time
 *                       proposalStatus:
 *                         type: string
 *                         enum: ["Draft", "Submitted"]
 *                       applicationStatus:
 *                         type: string
 *                         enum: ["Pending", "Approved"]
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post(
  '/create',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.CREATE_PROJECTS]),
  validateBody(CreateProjectInput),
  projectController.createProject
);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/project/associating-vehicles/{id}:
 *   put:
 *     summary: Step 2 - Associate vehicles to a project.
 *     description: Associate vehicles to a project.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehiclesIds:
 *                 type: array
 *                 item:
 *                  type: number
 *     responses:
 *       200:
 *         description: Project step-2 calculations and associations completed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put(
  '/associating-vehicles/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(AssociatingVehiclesToProjectInput),
  projectController.associatingVehicles
);

/**
 * @swagger
 * /api/project/associating-manpower/{id}:
 *   put:
 *     summary: Step 3 - Associate manpower and calculate costs for the project
 *     description: Handles project calculations and associations in Step 3 of project creation.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accommodationCost:
 *                 type: number
 *                 format: float
 *                 description: Accommodation cost per manpower
 *                 example: 3000.00
 *               foodCostPerDay:
 *                 type: number
 *                 format: float
 *                 description: Daily food allowance per manpower
 *                 example: 50.00
 *               managementAdditionPercentage:
 *                 type: number
 *                 format: float
 *                 description: Percentage added to total costs
 *                 example: 10.00
 *     responses:
 *       200:
 *         description: Project step-3 calculations and associations completed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put(
  '/associating-manpower/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(AssociatingManpowerToProjectInput),
  projectController.associatingManpower
);

/**
 * @swagger
 * /api/project/associating-materials/{id}:
 *   put:
 *     summary: Step 3 - Associate materials to a project and calculate project prices.
 *     description: Associate materials to a project and calculate project prices.
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               materialsIds:
 *                  type: array
 *                  items:
 *                   type : number
 *               materialMargin:
 *                 type: number
 *     responses:
 *       200:
 *         description: Project step-3 calculations and associations completed successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put(
  '/associating-materials/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(AssociatingMaterialsToProjectInput),
  projectController.associatingMaterials
);

/**
 * @swagger
 * /api/project/associating-asset/{id}:
 *   put:
 *     summary: Associate assets with a project
 *     description: Allows an admin to associate assets with an existing project using an array of asset IDs.
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to associate assets with
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of asset IDs to associate
 *                 example: ["899222d3-afb1-4479-9c9d-f1fc4d9a5629", "456e7890-e89b-12d3-a456-426614174001"]
 *     responses:
 *       200:
 *         description: Assets associated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put(
  '/associating-asset/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(AssociatingAssetToProjectInput),
  projectController.associatingAsset
);

/**
 * @swagger
 * /api/project/complete-project-creation/{id}:
 *   put:
 *     summary: Preview project details before confirmation
 *     description: Displays a preview of the project with all calculated costs and options to add a discount.
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to preview
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount:
 *                 type: number
 *                 format: float
 *                 description: discount
 *                 example: 5
 *               marginPercentage:
 *                 type: number
 *                 format: float
 *                 description: discount
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved project preview
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/complete-project-creation/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]),
  validateBody(completeProjectCreationInput),
  projectController.completeProjectCreation
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
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
 *         description: Search key for filtering projects
 *       - in: query
 *         name: sort
 *         required: false
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort direction
 *       - in: query
 *         name: sortBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [name, type, status, startDate, endDate, duration, totalCost, createdAt, category]
 *         description: Field to sort by
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ACTIVE, COMPLETE, ON_HOLD, CANCELLED]
 *         style: form
 *         explode: false
 *         description: Comma-separated list of project statuses
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Development, Research, Consulting]
 *         style: form
 *         explode: false
 *         description: Comma-separated list of project types
 *       - in: query
 *         name: fromStartDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter projects with start date from this date (inclusive)
 *       - in: query
 *         name: toStartDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter projects with start date until this date (inclusive)
 *       - in: query
 *         name: fromEndDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter projects with end date from this date (inclusive)
 *       - in: query
 *         name: toEndDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter projects with end date until this date (inclusive)
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Etimad, Direct]
 *     responses:
 *       200:
 *         description: List of projects
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get(
  '/',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  validateQuery(GetProjectsInput),
  projectController.getProjects
);

/**
 * @swagger
 * /api/project/excel/{email}:
 *   get:
 *     summary: Send filtered completed projects as an Excel file to the specified email
 *     tags: [Project]
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
 *           default: 1
 *         description: Page number (used for validation but ignored in export)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Page size (used for validation but ignored in export)
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering projects
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter projects by status
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter projects by type
 *       - in: query
 *         name: fromStartDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toStartDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: fromEndDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: toEndDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Etimad, Direct]
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
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  validateQuery(GetProjectsInput),
  projectController.sendProjectsExcelByEmail
);

/**
 * @swagger
 * /api/project/draft:
 *   get:
 *     summary: Get  draft project
 *     tags: [Project]
 *     responses:
 *       200:
 *         description: Successfully retrieved the project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/draft',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  projectController.getDraftProject
);

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the project
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([ProjectPermissionsEnum.VIEW_GLOBAL_PROJECTS, ProjectPermissionsEnum.VIEW_OWN_PROJECTS]),
  projectController.getProjectById
);

// ** --------------------- DELETE --------------------- **/

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Delete project
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to delete
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, HasPermission([ProjectPermissionsEnum.EDIT_PROJECTS]), projectController.deleteProject);

export default router;
