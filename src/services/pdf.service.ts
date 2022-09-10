import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import axios from 'axios';
import * as crypto from 'crypto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { queues } from '@utils/queue';
import { FileStorageService } from '@services/file-storage.service';
import { Queue } from 'bullmq';

export class PdfService {
  private readonly logger = new ScopedLogger(PdfService.name);
  constructor(private readonly fileStorageService = new FileStorageService(), private readonly pdfQueue: Queue = queues.pdfQueue) {}

  public async preProcessPdf(dto: PdfUploadDto): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    await this.pdfQueue.add(id, { id, url: dto.url });
    return { id };
  }

  public async downloadPdf(id: string, url: string) {
    this.logger.info('PDF download started');

    await this.validateURL(url);

    const fileUrl = await this.fileStorageService.downloadFile(url, 'pdfs', `${id}.pdf`);

    return { id: crypto.randomUUID(), url: fileUrl };
  }

  private async validateURL(url: string) {
    let response;

    try {
      response = await axios.get(url);
    } catch (err) {
      this.logger.error(`Error encountered while validating >> URL:: ${url}. Error:: ${err.message}`);
      throw new Error("We couldn't resolve the URL provided");
    }

    if (response.status !== 200) {
      throw new Error('The PDF URL provided does not resolve with a 200 OK status');
    }

    const pdfMimeType = mimeType.lookup('pdf');
    if (mimeType.contentType(response.headers['content-type']) !== pdfMimeType) {
      throw new Error('The URL provided does not reference a valid PDF document');
    }
  }
}
