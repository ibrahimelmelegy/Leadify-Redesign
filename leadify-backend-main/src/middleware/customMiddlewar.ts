import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import settingService from '../setting/settingService';
import validator from 'validator';

export const validateEmailConfiguration = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const setting = await settingService.getSetting();

    if (!setting?.emailApiKey) throw new BaseError(ERRORS.MISSING_EMAIL_CONFIGURATION);
    req.emailApiKey = setting.emailApiKey;

    next();
  } catch (error) {
    next(error);
  }
};

export const validateEmailParam = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.params;

    if (!validator.isEmail(email)) throw new BaseError(ERRORS.INVALID_EMAIL);

    next();
  } catch (error) {
    next(error);
  }
};
