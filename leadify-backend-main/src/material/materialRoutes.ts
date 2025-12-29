import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import { CreateMaterialInput } from './input/create-material.input';
import { AdditionalMaterialPermissionsEnum } from '../role/roleEnum';
import MaterialController from './material.controller';

const router = express.Router();

//** --------------------- POST --------------------- */
/**
 * @swagger
 * /api/material/:
 *  post:
 *   summary: Create a new  Material
 *   tags: [ Material ]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *             type: object
 *             required:
 *              - description
 *              - quantity
 *              - unitPrice
 *              - additionalMaterialItemIds
 *              - serviceId
 *             properties:
 *              description:
 *                type: string
 *                maxLength: 255
 *                description: The material description
 *              quantity:
 *                type: integer
 *                minimum: 1
 *                description: The quantity of the material
 *              unitPrice:
 *                type: number
 *                format: float
 *                maximum: 2
 *                description: The unit price of the material
 *              additionalMaterialItemIds:
 *                type: array
 *                items:
 *                  type: integer
 *                description: Array of additional material item IDs
 *              serviceId:
 *                type: string
 *                format: uuid
 *                description: The UUID of the associated service
 *   responses:
 *    201:
 *      description: material created successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *              name:
 *                type: string
 *                example: "category"
 *    400:
 *      description: Bad request
 *    500:
 *      description: Internal server error
 */

router.post(
  '/',
  authenticateUser,
  HasPermission([AdditionalMaterialPermissionsEnum.CREATE_ADDITIONAL_MATERIAL]),
  validateBody(CreateMaterialInput),
  MaterialController.createMaterial
);

//** --------------------- PUT --------------------- */

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/material/:
 *   get:
 *     summary: Get all materials
 *     tags: [Material]
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
 *         description: Search key for filtering projects
 *     responses:
 *       200:
 *         description: Materials retrieved successfully
 */
router.get('/', authenticateUser, HasPermission([AdditionalMaterialPermissionsEnum.VIEW_ADDITIONAL_MATERIAL]), MaterialController.getMaterials);

/**
 * @swagger
 * /api/material/{id}:
 *  get:
 *   summary: Get a material by ID
 *   tags: [Material]
 *   security:
 *     - bearerAuth: []
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: The ID of the material to retrieve
 *       schema:
 *         type: integer
 *   responses:
 *    200:
 *      description: Material retrieved successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *              description:
 *                type: string
 *                example: "Material description"
 *              quantity:
 *                type: integer
 *                example: 10
 *              unitPrice:
 *                type: number
 *                example: 100.50
 */
router.get('/:id', authenticateUser, HasPermission([AdditionalMaterialPermissionsEnum.VIEW_ADDITIONAL_MATERIAL]), MaterialController.getMaterialById);

export default router;
