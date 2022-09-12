import { Job, Worker } from 'bullmq';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';
import { LocalFileStorageAdapter } from '@adapters/file-storage/local.adapter';
import { WebhookWorkerJob } from '@interfaces/webhook-worker-job.interface';
import { logger } from '@utils/logger';

export const webhookWorker = new Worker(
  queues.webhook.name,
  async (job: Job<WebhookWorkerJob>) => {
    logger.info(
      `[${queues.webhook.name}] Attempting to notify webhook. URL:: ${job.data.url} Attempt:: ${job.attemptsMade}`,
    );
    const service = new PdfService(
      queues.pdf,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
      new PdfDocumentRepository(),
      new LocalFileStorageAdapter(),
    );
    const { statusCode } = await service.notifyWebhook(
      job.data.url,
      job.data.result,
    );
    if (statusCode < 200 || statusCode > 299) {
      throw new Error('Webhook URL did not respond with a valid status code.');
    }
  },
  { concurrency: 10, connection: queueConnection },
);
