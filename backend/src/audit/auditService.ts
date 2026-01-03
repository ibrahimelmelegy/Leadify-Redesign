import { Request } from 'express';
import AuditLog from './auditModel';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'EXPORT'
  | 'IMPORT';

export type EntityType =
  | 'USER'
  | 'LEAD'
  | 'OPPORTUNITY'
  | 'DEAL'
  | 'CLIENT'
  | 'PROJECT'
  | 'PROPOSAL'
  | 'ROLE'
  | 'NOTIFICATION'
  | 'SYSTEM';

interface LogOptions {
  userId: number;
  action: AuditAction;
  entityType: EntityType;
  entityId?: number;
  oldValues?: object;
  newValues?: object;
  metadata?: object;
  req?: Request;
}

export async function logAudit(options: LogOptions): Promise<AuditLog> {
  const { userId, action, entityType, entityId, oldValues, newValues, metadata, req } = options;

  return await AuditLog.create({
    userId,
    action,
    entityType,
    entityId,
    oldValues,
    newValues,
    metadata,
    ipAddress: req ? getClientIP(req) : undefined,
    userAgent: req ? req.headers['user-agent'] : undefined,
  });
}

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export async function getAuditLogs(filters: {
  userId?: number;
  action?: string;
  entityType?: string;
  entityId?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const { userId, action, entityType, entityId, startDate, endDate, page = 1, limit = 50 } = filters;
  
  const where: any = {};
  
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.$gte = startDate;
    if (endDate) where.createdAt.$lte = endDate;
  }

  const offset = (page - 1) * limit;

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    logs: rows,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };
}
