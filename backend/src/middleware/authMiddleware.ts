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

// In-memory cache for authenticated users (TTL: 5 minutes)
const userCache = new Map<string, { user: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Track last cleanup time to avoid cleaning on every request
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 60 * 1000; // Clean expired sessions every 1 minute max

export const authenticateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header('Authorization');
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized, no token provided' });
    return;
  }

  try {
    const SECRET_KEY = getJwtSecret();
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    const userId = decoded.id;
    const cacheKey = `${userId}:${token}`;

    // Check cache first
    const cached = userCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      req.user = cached.user;
      next();
      return;
    }

    // Delete expired sessions only periodically (not on every request)
    const now = Date.now();
    if (now - lastCleanupTime > CLEANUP_INTERVAL) {
      lastCleanupTime = now;
      Session.destroy({
        where: {
          userId: userId,
          expiresAt: { [Op.lt]: new Date() }
        }
      }).catch(() => {}); // Fire and forget
    }

    // Find the session in the database
    const session = await Session.findOne({
      where: {
        userId: userId,
        token: token,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!session) {
      userCache.delete(cacheKey);
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Attach the user to the request object
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'role' }]
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Cache the user
    userCache.set(cacheKey, { user, expiry: Date.now() + CACHE_TTL });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

export const HasPermission = (requiredPermissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user || !req.user.role || !req.user.role.permissions) throw new BaseError(ERRORS.ACCESS_DENIED);

      const userPermissions = new Set(req.user.role.permissions);
      
      // Check if user has 'all' permission (admin access)
      if (userPermissions.has('all')) {
        next();
        return;
      }
      
      const hasAnyPermission = requiredPermissions.some(permission => userPermissions.has(permission));

      if (!hasAnyPermission) throw new BaseError(ERRORS.ACCESS_DENIED);

      next();
    } catch (error) {
      next(error);
    }
  };
};
