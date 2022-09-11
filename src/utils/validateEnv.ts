import { cleanEnv, host, port, str, url } from 'envalid';
import { FileStorageEngine } from '@utils/constants';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    REDIS_HOST: host(),
    REDIS_PORT: port(),
    APP_URL: url(),
    UPLOADS_DIR: str(),
    FILE_STORAGE_ENGINE: str({
      choices: [FileStorageEngine.LOCAL, FileStorageEngine.MEMORY],
    }),
  });
};

export default validateEnv;
