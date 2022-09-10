import { REDIS_HOST, REDIS_PORT } from '@config';
import { Queue } from 'bullmq';

export const queueConnection = {
  host: REDIS_HOST,
  port: +REDIS_PORT,
};

export const queues = {
  pdfQueue: new Queue('pdf-queue', {
    connection: queueConnection,
  }),
};
