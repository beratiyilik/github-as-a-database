import { Router } from 'express';

export type RouteVersion = 'v1' | 'v2';

export interface Routes {
  path?: string;
  router: Router;
  version?: RouteVersion;

  getRootPath(): string;
}
