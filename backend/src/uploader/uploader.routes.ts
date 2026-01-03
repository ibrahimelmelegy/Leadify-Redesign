import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validation';
import uploaderController from './uploader.controller';
import { UploaderInput } from './uploader.input';

const router = express.Router();

router.post('/', authenticateUser, validateBody(UploaderInput), uploaderController.Upload);

export default router;
