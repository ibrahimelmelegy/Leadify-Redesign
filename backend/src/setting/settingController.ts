import { NextFunction, Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { wrapResult } from '../utils/response/responseWrapper';
import settingService from './settingService';
import { CreateOrUpdateSettingInput } from './inputs/createSettingInput';

class SettingController {
  public async createSetting(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateOrUpdateSettingInput;
      const responseFromService = await settingService.createOrUpdateSetting(body, req.user!.id);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async getSetting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await settingService.getSetting();
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
}

export default new SettingController();
