import { Job, Worker } from 'bullmq';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';
import { queueConnection, queues } from '@utils/queue';
import { PdfService } from '@services/pdf.service';
import { FileStorageService } from '@services/file-storage.service';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';

export const pdfWorker = new Worker(
  queues.pdfQueue.name,
  async (job: Job<PdfWorkerJob>) => {
    const service = new PdfService(
      new FileStorageService(),
      queues.pdfQueue,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
      new PdfDocumentRepository(),
    );
    const { name, isDuplicate } = await service.downloadPdf(job.data.url);
    if (!isDuplicate) {
      await service.generateThumbnail(name);
    }
  },
  { concurrency: 10, connection: queueConnection },
);
