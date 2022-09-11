import { Job, Worker } from 'bullmq';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';
import { FileStorageService } from '@services/file-storage.service';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';

export const pdfWorker = new Worker(
  queues.pdfQueue.name,
  async (job: Job<PdfWorkerJob>) => {
    const service = new PdfService(
      new FileStorageService(),
      queues.pdfQueue,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
    );
    await service.downloadPdf(job.data.id, job.data.url);
    await service.generateThumbnail(job.data.id);
  },
  { concurrency: 10, connection: queueConnection },
);
