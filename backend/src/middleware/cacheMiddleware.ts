import { Request, Response, NextFunction } from 'express';
import cacheService from '../utils/cache';

export const cacheMiddleware = (duration: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Skip caching for non-GET requests
        if (req.method !== 'GET') {
            next();
            return;
        }

        const key = `__express__${req.originalUrl || req.url}`;
        const cachedBody = cacheService.get(key);

        if (cachedBody) {
            res.send(cachedBody);
            return;
        }

        // Override res.send to cache the response
        const originalSend = res.send;
        res.send = (body: any): Response => {
            // Only cache successful responses
            if (res.statusCode === 200) {
                cacheService.set(key, body, duration);
            }
            return originalSend.call(res, body);
        };

        next();
    };
};
