import { Job, Worker } from 'bullmq';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';
import { LocalFileStorageAdapter } from '@adapters/file-storage/local.adapter';

export const pdfWorker = new Worker(
  queues.pdf.name,
  async (job: Job<PdfWorkerJob>) => {
    const service = new PdfService(
      queues.pdf,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
      new PdfDocumentRepository(),
      new LocalFileStorageAdapter(),
    );

    const { url, webhookUrl } = job.data;
    const { name, isDuplicate, url: pdfURL } = await service.downloadPdf(url);
    const thumbnailUrl = await service.generateThumbnail(name, isDuplicate);

    if (webhookUrl) {
      await queues.webhook.add('notify-webhook', {
        url: webhookUrl,
        result: { pdf: pdfURL, thumbnail: thumbnailUrl },
      });
    }
  },
  { concurrency: 10, connection: queueConnection },
);
