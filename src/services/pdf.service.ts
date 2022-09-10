import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import axios from 'axios';
import * as crypto from 'crypto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { Queue } from 'bullmq';
import { FileStreamResponse, HttpClientAdapter } from '@interfaces/http-client-adapter.interface';
import { FileStorageService } from '@services/file-storage.service';

export class PdfService {
  private readonly logger = new ScopedLogger(PdfService.name);

  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly pdfQueue: Queue,
    private readonly httpClient: HttpClientAdapter,
  ) {}

  public async preProcessPdf(dto: PdfUploadDto): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    await this.pdfQueue.add(id, { id, url: dto.url });
    return { id };
  }

  public async downloadPdf(id: string, url: string) {
    this.logger.info('PDF download started');

    const response: FileStreamResponse = await this.httpClient.getFileFromUrl(url);

    if (response.status !== 200) {
      throw new Error('The PDF URL provided does not resolve with a 200 OK status');
    }

    const pdfMimeType = mimeType.lookup('pdf');
    if (response.mimeType !== pdfMimeType) {
      throw new Error('The URL provided does not reference a valid PDF document');
    }

    const fileUrl = await this.fileStorageService.downloadFile(response.fileStream, 'pdfs', `${id}.pdf`);

    return { id, url: fileUrl };
  }
}
