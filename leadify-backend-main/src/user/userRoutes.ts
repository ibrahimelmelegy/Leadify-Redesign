import express from 'express';
import userController from './userController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateUserInput } from './inputs/createUserInput';
import { UpdateUserInput } from './inputs/updateUserInput';
import { GetUsersInput } from './inputs/getUsersInput';
import { StaffPermissionsEnum } from '../role/roleEnum';
import { validateEmailParam, validateEmailConfiguration } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/
/**
 * @swagger
 * /api/users/create-superadmin:
 *   post:
 *     summary: Create a super admin user
 *     description: Creates a new super admin user with predefined details. Should be used only once.
 *     tags: [User]
 *     responses:
 *       201:
 *         description: Super admin user created successfully
 *       500:
 *         description: Server error
 */
router.post('/create-superadmin', userController.createSuperAdmin);

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided details. Requires admin authentication.
 *     tags: [User]
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
 *                 description: User's full name
 *                 maxLength: 100
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password
 *                 example: "password123"
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *                 example: "+1234567890"
 *               profilePicture:
 *                 type: string
 *                 description: URL of the user's profile picture
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: The role ID for the user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authenticateUser, HasPermission([StaffPermissionsEnum.CREATE_STAFF]), validateBody(CreateUserInput), userController.createUser);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user details
 *     description: Updates an existing user based on provided fields. Requires authentication.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: User's password
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 description: User's status
 *               profilePicture:
 *                 type: string
 *                 description: URL of the user's profile picture
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: The role ID for the user
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put(
  '/:id',
  authenticateUser,
  HasPermission([StaffPermissionsEnum.EDIT_STAFF]),
  HasPermission([StaffPermissionsEnum.VIEW_GLOBAL_STAFF]),
  validateBody(UpdateUserInput),
  userController.updateUser
);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *             - email
 *             - status
 *             - createdAt
 *         description: Field to sort by
 *         example: "createdAt"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - ACTIVE
 *             - INACTIVE
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticateUser, HasPermission([StaffPermissionsEnum.VIEW_GLOBAL_STAFF]), validateQuery(GetUsersInput), userController.getUsers);

/**
 * @swagger
 * /api/users/excel/{email}:
 *   get:
 *     summary: Send filtered users as an Excel file to the specified email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
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
 *         description: Filter by name or email
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, email, status, createdAt]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *       - in: query
 *         name: roleId
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
  HasPermission([StaffPermissionsEnum.VIEW_GLOBAL_STAFF]),
  validateQuery(GetUsersInput),
  userController.sendUsersExcelByEmail
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, HasPermission([StaffPermissionsEnum.VIEW_GLOBAL_STAFF]), userController.getUserById);

// ** --------------------- DELETE --------------------- **/

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Requires admin authentication.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateUser, HasPermission([StaffPermissionsEnum.EDIT_STAFF]), userController.deleteUser);

export default router;
