import { Job, Worker } from 'bullmq';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';
import { FileStorageService } from '@services/file-storage.service';
import { AxiosHttpClientAdapter } from '@/adapters/http-client/axios.adapter';

export const pdfWorker = new Worker(
  queues.pdfQueue.name,
  async (job: Job<PdfWorkerJob>) => {
    const service = new PdfService(new FileStorageService(), queues.pdfQueue, new AxiosHttpClientAdapter());
    return await service.downloadPdf(job.data.id, job.data.url);
  },
  { concurrency: 10, connection: queueConnection },
);
