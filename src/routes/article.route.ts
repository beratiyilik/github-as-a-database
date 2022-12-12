import { Router } from 'express';
import ArticleController from '@/controllers/article.controller';
import { RouteVersion, Routes } from '@interfaces/routes.interface';

class ArticleRoute implements Routes {
  public path = '/article';
  public router = Router();
  public version?: RouteVersion = 'v1';
  public controller = new ArticleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.get);
    this.router.get(`${this.path}/:id`, this.controller.getById);
    this.router.patch(`${this.path}/:id`, this.controller.update);
  }

  public getRootPath = (): string => (this.version ? `/api/${this.version}` : '/api/');
}

export default ArticleRoute;
