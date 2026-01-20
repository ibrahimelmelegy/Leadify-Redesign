import NodeCache from 'node-cache';

// Standard TTL: 5 minutes, Check period: 1 minute
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const cacheService = {
    get: <T>(key: string): T | undefined => {
        return cache.get<T>(key);
    },

    set: <T>(key: string, value: T, ttl?: number): boolean => {
        return cache.set(key, value, ttl || 300);
    },

    del: (key: string): number => {
        return cache.del(key);
    },

    flush: (): void => {
        cache.flushAll();
    },

    // Helper to generate keys consistently
    generateKey: (prefix: string, identifier: string | number): string => {
        return `${prefix}:${identifier}`;
    }
};

export default cacheService;
