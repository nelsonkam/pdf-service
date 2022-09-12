import { REDIS_HOST, REDIS_PORT } from '@config';
import { Queue } from 'bullmq';

export const queueConnection = {
  host: REDIS_HOST,
  port: +REDIS_PORT,
};

export const queues = {
  pdf: new Queue('pdf-queue', {
    connection: queueConnection,
  }),
  webhook: new Queue('webhook-queue', {
    connection: queueConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 1000 * 60 * 5, // 5 minutes delay
      },
    },
  }),
};
