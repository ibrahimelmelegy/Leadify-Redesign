import { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;
const LOGIN_MAX_REQUESTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

export function rateLimiter(options?: { maxRequests?: number; windowMs?: number }) {
  const maxRequests = options?.maxRequests || MAX_REQUESTS;
  const windowMs = options?.windowMs || WINDOW_MS;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = getClientIP(req);
    const key = `${clientIP}:${req.path}`;
    const now = Date.now();

    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.',
        retryAfter
      });
    }

    entry.count++;
    return next();
  };
}

export function loginRateLimiter() {
  return rateLimiter({
    maxRequests: LOGIN_MAX_REQUESTS,
    windowMs: LOGIN_WINDOW_MS
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000);
