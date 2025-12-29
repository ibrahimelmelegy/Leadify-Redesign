import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import { CreateOrUpdateSettingInput } from './inputs/createSettingInput';
import SettingController from './settingController';
import { SettingsPermissionsEnum } from '../role/roleEnum';

const router = express.Router();

//** --------------------- POST --------------------- */

/**
 * @swagger
 * /api/setting/:
 *   post:
 *     summary: Create new setting
 *     description: Create a new setting with the provided details. Requires authentication.
 *     tags: [Setting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              emailApiKey:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *                maxLength: 50
 *                description: Email address of the setting. Required if phoneNumber is not provided.
 *              name:
 *                type: string
 *              logo:
 *                type: string
 *              favIcon:
 *                type: string
 *              primaryColor:
 *                type: string
 *              secondaryColor:
 *                type: string
 *     responses:
 *       201:
 *         description: setting created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

router.post(
  '/',
  authenticateUser,
  HasPermission([SettingsPermissionsEnum.EDIT_SETTINGS]),
  validateBody(CreateOrUpdateSettingInput),
  SettingController.createSetting
);

//** --------------------- GET --------------------- */

/**
 * @swagger
 * /api/api/setting/:
 *   get:
 *     summary: Get all settings
 *     tags: [Setting]
 *     responses:
 *       200:
 *         description: Setting Information
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get('/', authenticateUser, HasPermission([SettingsPermissionsEnum.VIEW_SETTINGS]), SettingController.getSetting);

//** --------------------- DELETE --------------------- */

export default router;
