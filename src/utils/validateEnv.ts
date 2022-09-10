import { cleanEnv, host, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    REDIS_HOST: host(),
    REDIS_PORT: port(),
  });
};

export default validateEnv;
