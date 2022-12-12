import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    GITHUB_PERSONAL_ACCESS_TOKEN: str(),
    GITHUB_OWNER: str(),
    GITHUB_REPO: str(),
  });
};

export default validateEnv;
