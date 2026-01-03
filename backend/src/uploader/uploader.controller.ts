import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { wrapResult } from '../utils/response/responseWrapper';
import uploaderService from './uploader.service';

class UploaderController {
  public async Upload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploadedFile = (<any>req).files.file;
      const responseFromService = await uploaderService.createFile(uploadedFile, req.body.model);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new UploaderController();
