import { Request, Response, NextFunction, Router } from 'express';

export interface ApiVersion {
  version: string;
  deprecated?: boolean;
  sunset?: string;
}

const API_VERSIONS: ApiVersion[] = [
  { version: 'v1' },
];

export function versionMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestedVersion = req.headers['api-version'] as string || 'v1';
  const version = API_VERSIONS.find(v => v.version === requestedVersion);
  
  if (!version) {
    return res.status(400).json({
      error: 'Invalid API version',
      supportedVersions: API_VERSIONS.map(v => v.version)
    });
  }

  if (version.deprecated) {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', version.sunset || '');
    res.setHeader('X-API-Warn', `API version ${version.version} is deprecated`);
  }

  (req as any).apiVersion = version.version;
  next();
}

export function createVersionedRouter(version: string): Router {
  const router = Router();
  
  router.use((req, res, next) => {
    (req as any).apiVersion = version;
    next();
  });
  
  return router;
}

export function getApiVersion(req: Request): string {
  return (req as any).apiVersion || 'v1';
}
