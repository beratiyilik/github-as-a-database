import { Routes } from '../interfaces/routes.interface';
import AuthRoute from './auth.route';
import IndexRoute from './index.route';
import UsersRoute from './users.route';
import ArticleRoute from './article.route';
import ReviewRoute from './review.route';

const routes: Routes[] = [new IndexRoute(), new AuthRoute(), new UsersRoute(), new ArticleRoute(), new ReviewRoute()];

export default routes;
