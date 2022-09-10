import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN, REDIS_HOST, REDIS_PORT, APP_URL, UPLOADS_DIR, FILE_STORAGE_ENGINE } = process.env;
