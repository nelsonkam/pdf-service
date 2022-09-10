import { Job, Worker } from 'bullmq';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';

export const pdfWorker = new Worker(
  queues.pdfQueue.name,
  async (job: Job<PdfWorkerJob>) => {
    const service = new PdfService();
    return await service.downloadPdf(job.data.id, job.data.url);
  },
  { concurrency: 10, connection: queueConnection },
);
