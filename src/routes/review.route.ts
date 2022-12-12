import { Router } from 'express';
import { ReviewController } from '@/controllers';
import { RouteVersion, Routes } from '@interfaces/routes.interface';

class ReviewRoute implements Routes {
  public path = '/review';
  public router = Router();
  public version?: RouteVersion = 'v1';
  public controller = new ReviewController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.controller.get);
    this.router.post(`${this.path}`, this.controller.create);
    this.router.delete(`${this.path}/:id`, this.controller.delete);
  }

  public getRootPath = (): string => (this.version ? `/api/${this.version}` : '/api/');
}

export default ReviewRoute;
