import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateAdditionalMaterialInput, UpdateAdditionalMaterialInput } from './inputs/create-additional-material.input';
import { GetPaginatedAdditionalMaterialInput } from './inputs/paginated-material.input';
import AdditionalMaterialController from './additionalMaterial.controller';
import { AdditionalMaterialPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

//** --------------------- POST --------------------- */
/**
 * @swagger
 * /api/additional-material/create:
 *  post:
 *   summary: Create a new additional material
 *   tags: [Additional Material]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              example: "category"
 *            items:
 *              type: array
 *              items:
 *                type: object
 *                example: [{name: "item 1", price: 12.5}]
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
  '/create',
  authenticateUser,
  HasPermission([AdditionalMaterialPermissionsEnum.CREATE_ADDITIONAL_MATERIAL]),
  validateBody(CreateAdditionalMaterialInput),
  AdditionalMaterialController.createMaterial
);

//** --------------------- PUT --------------------- */

/**
 *
 * @swagger
 * /api/additional-material/update:
 *  post:
 *   summary: update an existing material
 *   tags: [Additional Material ]
 *   security:
 *     - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *      application/json:
 *        schema:
 *          type: object
 *          properties:
 *            materialId:
 *              type: integer
 *              example: 12
 *            name:
 *              type: string
 *              example: "category"
 *            deletedItemsIds:
 *              type: array
 *              example: [1,2,3]
 *            items:
 *              type: array
 *              items:
 *                type: object
 *                example: [{id: 5, name: "item 1", price: 12.5},{name: "item 2", price: 12.5}]
 *   responses:
 *    201:
 *      description: material updated successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: number
 *                example: 1
 *    400:
 *      description: Bad request
 *    500:
 *      description: Internal server error
 */
router.post(
  '/update',
  authenticateUser,
  HasPermission([AdditionalMaterialPermissionsEnum.EDIT_ADDITIONAL_MATERIAL]),
  validateBody(UpdateAdditionalMaterialInput),
  AdditionalMaterialController.updateMaterial
);

//** --------------------- GET --------------------- */
/**
 * @swagger
 * /api/additional-material/:
 *  get:
 *   summary: Get paginated  materials
 *   tags: [Additional Material ]
 *   parameters:
 *     - in: path
 *       name: page
 *       schema:
 *         type: integer
 *         min: 1
 *         default: 1
 *     - in: path
 *       name: limit
 *       schema:
 *         type: integer
 *         min: 1
 *         default: 1
 *     - in: path
 *       name: sortBy
 *       schema:
 *         type: string
 *         enum:
 *           - "rentCost"
 *           - "gasCost"
 *           - "oilCost"
 *     - in: path
 *       name: sort
 *       schema:
 *         type: string
 *         enum:
 *           - "ASC"
 *           - "DESC"
 *   responses:
 *     200:
 *       description: List of materials
 *     400:
 *       description: Bad Request
 *     500:
 *       description: Internal server error
 *
 */

router.get(
  '/',
  authenticateUser,
  HasPermission([AdditionalMaterialPermissionsEnum.VIEW_ADDITIONAL_MATERIAL]),
  validateQuery(GetPaginatedAdditionalMaterialInput),
  AdditionalMaterialController.getMaterials
);

/**
 * @swagger
 * /api/additional-material/excel/{email}:
 *   get:
 *     summary: Send additional materials data as an Excel file to the specified email
 *     tags: [Additional Material ]
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
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
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
  HasPermission([AdditionalMaterialPermissionsEnum.VIEW_ADDITIONAL_MATERIAL]),
  validateQuery(GetPaginatedAdditionalMaterialInput),
  AdditionalMaterialController.sendMaterialsExcelByEmail
);

/**
 * @swagger
 * /api/additional-material/{id}:
 *  get:
 *   summary: Get a material by ID
 *   tags: [Additional Material ]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID of the material to retrieve
 *   responses:
 *     200:
 *       description: Successfully retrieved material
 *     404:
 *       description: material not found
 *     500:
 *       description: Internal server error
 *
 */
router.get(
  '/:id',
  authenticateUser,
  HasPermission([AdditionalMaterialPermissionsEnum.VIEW_ADDITIONAL_MATERIAL]),
  AdditionalMaterialController.getMaterialById
);

export default router;
