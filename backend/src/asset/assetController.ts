import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import assetService from './assetService';

class AssetController {
  public async createAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await assetService.createAsset(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  public async updateAsset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await assetService.updateAsset(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async getAssets(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await assetService.getAssets(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async assetById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await assetService.assetById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async sendAssetsExcelByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await assetService.sendAssetsExcelByEmail(req.query, req.params.email);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }
}

export default new AssetController();
