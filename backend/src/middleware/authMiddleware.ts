import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { AuthenticatedRequest } from '../types';
import Session from '../user/models/sessionModel';
import User from '../user/userModel';
import Role from '../role/roleModel';
import BaseError from '../utils/error/base-http-exception';
import { ERRORS } from '../utils/error/errors';
import { getJwtSecret } from '../config/security';

interface JwtPayload {
  id: string;
}

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized, no token provided' });
    return;
  }

  try {
    const SECRET_KEY = getJwtSecret();
    // Decode the token to get the user ID
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const userId = decoded.id;

    // Delete expired sessions for the user
    await Session.destroy({
      where: {
        userId: userId,
        expiresAt: { [Op.lt]: new Date() } // Delete sessions that are expired
      }
    });

    // Find the session in the database
    const session = await Session.findOne({
      where: {
        userId: userId,
        token: token,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    // If session is not found or the token is invalid, return error
    if (!session) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Attach the user to the request object for future use
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'role' }]
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const HasPermission = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user || !req.user.role || !req.user.role.permissions) throw new BaseError(ERRORS.ACCESS_DENIED);

      const userPermissions = new Set(req.user.role.permissions);
      const hasAnyPermission = requiredPermissions.some(permission => userPermissions.has(permission));

      if (!hasAnyPermission) throw new BaseError(ERRORS.ACCESS_DENIED);

      next();
    } catch (error) {
      next(error);
    }
  };
};
