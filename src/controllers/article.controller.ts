import { NextFunction, Request, Response } from 'express';
import ArticleService from '@/services/article.service';

class ArticleController {
  public service = new ArticleService();

  public get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch = (req.query.branch || 'main') as string;
      const { content: data, etag } = await this.service.get(branch);
      res.set('ETag', etag);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch = (req.query.branch || 'main') as string;
      const id = String(req.params.id);
      const { content: data, etag } = await this.service.getById(branch, id);
      res.set('ETag', etag);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch = (req.query.branch || 'main') as string;
      const id = String(req.params.id);
      const data = req.body;
      const { etag, location } = await this.service.update(branch, id, data);
      res.setHeader('ETag', etag);
      res.setHeader('Location', location);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default ArticleController;
