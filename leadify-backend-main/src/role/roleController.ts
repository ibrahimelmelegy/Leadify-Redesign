import { Request, Response, NextFunction } from 'express';
import { wrapResult } from '../utils/response/responseWrapper';
import roleService from './roleService';

class RoleController {
  public async createSuperAdminRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roleService.createSuperAdminRole();
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await roleService.createRole(req.body);
      wrapResult(res, responseFromService, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Update an existing role
   * @route PUT /api/role/:id
   * @access Admin
   */
  public async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await roleService.updateRole(req.params.id, req.body);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get all roles (with pagination & filtering)
   * @route GET /api/role/
   * @access Admin
   */
  public async getRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await roleService.getRoles(req.query);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc Get a role by ID
   * @route GET /api/role/:id
   * @access Admin
   */
  public async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await roleService.getRoleById(req.params.id);
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }

  public async deleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await roleService.deleteRole(req.params.id);
      wrapResult(res);
    } catch (error) {
      next(error);
    }
  }

  public async getPremissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const responseFromService = await roleService.getPremissions();
      wrapResult(res, responseFromService);
    } catch (error) {
      next(error);
    }
  }
}

export default new RoleController();
