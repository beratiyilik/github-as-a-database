import { Router } from 'express';
import IndexController from '@controllers/index.controller';
import { RouteVersion, Routes } from '@interfaces/routes.interface';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  public version?: RouteVersion = 'v1';
  public indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }

  public getRootPath = (): string => (this.version ? `/api/${this.version}` : '/api/');
}

export default IndexRoute;
