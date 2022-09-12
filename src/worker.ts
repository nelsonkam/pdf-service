import { QueueScheduler, Worker } from 'bullmq';
import { logger } from '@utils/logger';
import { NODE_ENV, REDIS_HOST, REDIS_PORT } from '@config';
import { pdfWorker } from '@/workers/pdf.worker';
import { webhookWorker } from '@/workers/webhook.worker';

function start(workers: Worker[]) {
  logger.info(`=================================`);
  logger.info(`======= ENV: ${NODE_ENV || 'development'} =======`);
  logger.info(`🛠 Starting worker process`);
  logger.info(`=================================`);
  workers.forEach(worker => {
    new QueueScheduler(worker.name, {
      connection: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
      },
    });

    worker.on('active', job => {
      logger.info(
        `[${worker.name}] Job Started >> JobId:: ${job.id}, Name:: ${job.name}`,
      );
    });

    worker.on('completed', job => {
      logger.info(
        `[${worker.name}] Job Completed >> JobId:: ${job.id}, Name:: ${job.name}`,
      );
    });

    worker.on('failed', (job, error) => {
      console.error(
        `[${worker.name}] Job Failed >> JobId:: ${job.id}, Error:: ${error.name}, Message:: ${error.message}`,
      );
      logger.error(
        `[${worker.name}] Job Failed >> JobId:: ${job.id}, Error:: ${error.name}, Message:: ${error.message}`,
      );
    });

    worker.on('error', error => {
      console.error(
        `[${worker.name}] Error >> Error:: ${error.name}, Message:: ${error.message}`,
      );
      logger.error(
        `[${worker.name}] Error >> Error:: ${error.name}, Message:: ${error.message}`,
      );
    });

    logger.info(`[${worker.name}] Worker registered`);
  });
}

start([pdfWorker, webhookWorker]);
