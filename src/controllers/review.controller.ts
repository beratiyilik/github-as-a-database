import { NextFunction, Request, Response } from 'express';
import { ReviewService } from '@/services';

class ReviewController {
  public service = new ReviewService();

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

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch = (req.query.branch || 'main') as string;
      const { content: data, etag, location } = await this.service.create(branch, req.body);
      res.set('ETag', etag);
      res.set('Location', location);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const branch: string = (req.query.branch || 'main') as string;
      const id = String(req.params.id);
      const { content: data, etag, location } = await this.service.delete(branch, id);
      res.set('ETag', etag);
      res.set('Location', location);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default ReviewController;
