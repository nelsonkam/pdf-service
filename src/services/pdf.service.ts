import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import axios from 'axios';
import * as crypto from 'crypto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { HttpException } from '@exceptions/HttpException';
import { queues } from '@utils/queue';
import { Job } from 'bullmq';

export class PdfService {
  private logger = new ScopedLogger(PdfService.name);
  public async preProcessPdf(dto: PdfUploadDto): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    await queues.pdfQueue.add(id, { id, url: dto.url });
    return { id };
  }

  public async processPdf(id: string, url: string) {
    this.logger.info('PDF processing started');

    await this.validateURL(url);

    return { id: crypto.randomUUID() };
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
