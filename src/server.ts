import App from '@/app';
import validateEnv from '@utils/validateEnv';
import routes from '@/routes';

validateEnv();

const app = new App(routes);

app.listen();
