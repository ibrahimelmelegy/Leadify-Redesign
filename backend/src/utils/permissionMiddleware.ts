import { Request, Response, NextFunction } from 'express';
import Role from '../role/roleModel';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const role = await Role.findByPk(req.user.roleId);
      
      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Role not found'
        });
      }

      const permissions = role.permissions || [];
      
      if (permissions.includes('all') || permissions.includes(permission)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
}

export function requireAnyPermission(permissions: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const role = await Role.findByPk(req.user.roleId);
      
      if (!role) {
        return res.status(403).json({
          success: false,
          message: 'Role not found'
        });
      }

      const userPermissions = role.permissions || [];
      
      if (userPermissions.includes('all')) {
        return next();
      }

      const hasPermission = permissions.some(p => userPermissions.includes(p));
      
      if (hasPermission) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
}
