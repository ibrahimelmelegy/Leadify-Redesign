import express from 'express';
import assetController from './assetController';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody, validateQuery } from '../middleware/validation';
import { CreateAssetInput } from './inputs/createAssetInput';
import { UpdateAssetInput } from './inputs/updateAssetInput';
import { GetAssetsInput } from './inputs/getAssetsInput';
import { AssetPermissionsEnum } from '../role/roleEnum';
import { validateEmailConfiguration, validateEmailParam } from '../middleware/customMiddlewar';

const router = express.Router();

// ** --------------------- POST --------------------- **/

/**
 * @swagger
 * /api/asset/:
 *   post:
 *     summary: Create new asset.
 *     description: Create a new asset with the provided details. Requires authentication.
 *     tags: [Asset]
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
 *                 description: Name of the asset
 *                 maxLength: 100
 *                 example: Office Chair
 *               rentPrice:
 *                 type: number
 *                 format: float
 *                 description: Monthly rental price of the asset
 *                 example: 50.00
 *               buyPrice:
 *                 type: number
 *                 format: float
 *                 description: Purchase price of the asset
 *                 example: 200.00
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authenticateUser, HasPermission([AssetPermissionsEnum.CREATE_ASSETS]), validateBody(CreateAssetInput), assetController.createAsset);

// ** --------------------- PUT --------------------- **/

/**
 * @swagger
 * /api/asset/{id}:
 *   put:
 *     summary: Update asset
 *     description: Updates an existing asset based on the provided fields. Requires authentication.
 *     tags: [Asset]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the asset
 *                 maxLength: 100
 *               rentPrice:
 *                 type: number
 *                 format: float
 *                 description: Monthly rental price of the asset
 *               buyPrice:
 *                 type: number
 *                 format: float
 *                 description: Purchase price of the asset
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       400:
 *         description: Validation error
 *       618:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateUser, HasPermission([AssetPermissionsEnum.EDIT_ASSETS]), validateBody(UpdateAssetInput), assetController.updateAsset);

// ** --------------------- GET --------------------- **/

/**
 * @swagger
 * /api/asset/:
 *   get:
 *     summary: Get all assets
 *     tags: [Asset]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of assets per page
 *       - in: query
 *         name: searchKey
 *         required: false
 *         schema:
 *           type: string
 *         description: Search key for filtering assets
 *       - in: query
 *         name: fromRentPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Minimum rent price filter
 *       - in: query
 *         name: toRentPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum rent price filter
 *       - in: query
 *         name: fromBuyPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Minimum buy price filter
 *       - in: query
 *         name: toBuyPrice
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum buy price filter
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
 *           enum: [name, rentPrice, buyPrice]
 *         description: Field to sort by
 *     responses:
 *       200:
 *         description: List of assets
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.get('/', authenticateUser, HasPermission([AssetPermissionsEnum.VIEW_ASSETS]), validateQuery(GetAssetsInput), assetController.getAssets);

/**
 * @swagger
 * /api/asset/excel/{email}:
 *   get:
 *     summary: Send filtered assets as an Excel file to the specified email
 *     tags: [Asset]
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
 *         required: false
 *         schema:
 *           type: string
 *         description: Search in name, rentPrice, buyPrice
 *       - in: query
 *         name: fromRentPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: toRentPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: fromBuyPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: toBuyPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, rentPrice, buyPrice, createdAt]
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
  HasPermission([AssetPermissionsEnum.VIEW_ASSETS]),
  validateQuery(GetAssetsInput),
  assetController.sendAssetsExcelByEmail
);

/**
 * @swagger
 * /api/asset/{id}:
 *   get:
 *     summary: Get a single asset by ID
 *     tags: [Asset]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the asset to retrieve
 *     responses:
 *       200:
 *         description: Asset found
 *       618:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateUser, HasPermission([AssetPermissionsEnum.VIEW_ASSETS]), assetController.assetById);

export default router;
