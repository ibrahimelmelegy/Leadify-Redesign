import express from 'express';
import roleController from './roleController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateRoleInput } from './inputs/createRoleInput';
import { UpdateRoleInput } from './inputs/updateRoleInput';
import { GetRolesInput } from './inputs/getRolesInput';
import { RolePermissionsEnum } from './roleEnum';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/role/create-superadmin:
 *   post:
 *     summary: Create a super admin role
 *     description: Creates a new super admin role with predefined details. Should be used only once.
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: Super admin role created successfully
 *       500:
 *         description: Server error
 */
router.post('/create-superadmin', roleController.createSuperAdminRole);

/**
 * @swagger
 * /api/role/:
 *   post:
 *     summary: Create a new role
 *     description: Creates a new role with the provided details. Requires admin authentication.
 *     tags: [Role]
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
 *                 description: Role name (must be unique)
 *                 maxLength: 255
 *                 example: Admin
 *               description:
 *                 type: string
 *                 description: Role description (optional)
 *                 example: "Administrator role with full access"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permissions assigned to this role
 *                 example: ["user:create", "user:edit"]
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateUser, HasPermission([RolePermissionsEnum.CREATE_ROLES]), validateBody(CreateRoleInput), roleController.createRole);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/role/{id}:
 *   put:
 *     summary: Update a role
 *     description: Updates an existing role based on the provided fields. Requires admin authentication.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated role name (must be unique)
 *                 maxLength: 255
 *               description:
 *                 type: string
 *                 description: Updated role description (optional)
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated permissions for the role
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateUser, HasPermission([RolePermissionsEnum.EDIT_ROLES]), validateBody(UpdateRoleInput), roleController.updateRole);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/role/premissions:
 *   get:
 *     summary: Get all premissions
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of premissions
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/premissions', authenticateUser, HasPermission([RolePermissionsEnum.VIEW_ROLES]), roleController.getPremissions);

/**
 * @swagger
 * /api/role/:
 *   get:
 *     summary: Get all roles
 *     description: Retrieves a paginated list of roles. Requires admin authentication.
 *     tags: [Role]
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
 *           default: 20
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering roles by name
 *     responses:
 *       200:
 *         description: List of roles
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticateUser, HasPermission([RolePermissionsEnum.VIEW_ROLES]), validateQuery(GetRolesInput), roleController.getRoles);

/**
 * @swagger
 * /api/role/{id}:
 *   get:
 *     summary: Get a role by ID
 *     description: Retrieves a single role based on the provided ID. Requires admin authentication.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, HasPermission([RolePermissionsEnum.VIEW_ROLES]), roleController.getRoleById);

// ** --------------------- DELETE --------------------- **/

/**
 * @swagger
 * /api/role/{id}:
 *   delete:
 *     summary: Delete a role
 *     description: Deletes a role by ID. Requires admin authentication.
 *     tags: [Role]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, HasPermission([RolePermissionsEnum.EDIT_ROLES]), roleController.deleteRole);

export default router;
