import App from '@/app';
import { validateEnv, enableErrorToJSON } from '@/utils';
import routes from '@/routes';

validateEnv();
enableErrorToJSON();

const app = new App(routes);

app.listen();
