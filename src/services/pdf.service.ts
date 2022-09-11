import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import * as crypto from 'crypto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { Queue } from 'bullmq';
import {
  FileStreamResponse,
  HttpClientAdapter,
} from '@interfaces/http-client-adapter.interface';
import { FileStorageService } from '@services/file-storage.service';
import { GraphicsAdapter } from '@interfaces/graphics-adapter.interface';

export class PdfService {
  private readonly logger = new ScopedLogger(PdfService.name);

  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly pdfQueue: Queue,
    private readonly httpClient: HttpClientAdapter,
    private readonly graphics: GraphicsAdapter,
  ) {}

  /**
   * Generates an ID for the document and adds it to the queue
   * for processing
   *
   * @param dto
   */
  public async preProcessPdf(dto: PdfUploadDto): Promise<{ id: string }> {
    const id = crypto.randomUUID();
    await this.pdfQueue.add(id, { id, url: dto.url });
    return { id };
  }

  /**
   * Saves PDF document to the file storage
   *
   * @param id
   * @param url
   */
  public async downloadPdf(id: string, url: string) {
    this.logger.info(`PDF download started for ${id}`);

    const response: FileStreamResponse = await this.httpClient.getFileFromUrl(
      url,
    );

    if (response.status !== 200) {
      throw new Error(
        'The PDF URL provided does not resolve with a 200 OK status',
      );
    }

    const pdfMimeType = mimeType.lookup('pdf');
    if (response.mimeType !== pdfMimeType) {
      throw new Error(
        'The URL provided does not reference a valid PDF document',
      );
    }

    const fileUrl = await this.fileStorageService.downloadFile(
      response.fileStream,
      'pdfs',
      `${id}.pdf`,
    );

    this.logger.info(`PDF download finished for ${id}`);

    return { id, url: fileUrl };
  }

  public async generateThumbnail(id: string) {
    this.logger.info(`Thumbnail generation started for ${id}`);

    const stream = await this.fileStorageService.readFile('pdfs', `${id}.pdf`);
    const thumbnailStream = await this.graphics.convertPdfPageToImage(
      stream,
      0,
    );
    const url = await this.fileStorageService.downloadFile(
      thumbnailStream,
      'thumbnails',
      `${id}.png`,
    );

    this.logger.info(`Thumbnail generation finished for ${id}`);
    return { id, url };
  }
}
