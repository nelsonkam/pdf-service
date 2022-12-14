import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { Queue } from 'bullmq';
import {
  FileResponse,
  HttpClientAdapter,
} from '@interfaces/http-client-adapter.interface';
import { GraphicsAdapter } from '@interfaces/graphics-adapter.interface';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';
import { BUCKETS } from '@utils/constants';
import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import { generateChecksum } from '@/utils';
import { PdfDocumentResponse } from '@dtos/pdf-document-response.dto';
import { PdfWorkerJob } from '@interfaces/pdf-worker-job.interface';

export class PdfService {
  private readonly logger = new ScopedLogger(PdfService.name);

  constructor(
    private readonly pdfQueue: Queue<PdfWorkerJob>,
    private readonly httpClient: HttpClientAdapter,
    private readonly graphics: GraphicsAdapter,
    private readonly repository: PdfDocumentRepository,
    private readonly fileStorage: FileStorageAdapter,
  ) {}

  /**
   * Returns a list of all stored PDF document and their associated thumbnails
   */
  public async getDocuments() {
    const documents = await this.repository.findAll();
    return documents.map(document => {
      return {
        pdf: this.fileStorage.getURL(BUCKETS.PDF, `${document.name}.pdf`),
        thumbnail: this.fileStorage.getURL(
          BUCKETS.THUMBNAIL,
          `${document.name}.png`,
        ),
      };
    });
  }

  /**
   * Adds job to the queue for processing
   *
   * @param dto
   */
  public async preProcessPdf(dto: PdfUploadDto) {
    await this.pdfQueue.add('process-pdf', dto);
  }

  /**
   * Saves PDF document to the file storage. Checks for duplicates
   * using checksum.
   *
   * @param url
   */
  public async downloadPdf(url: string) {
    this.logger.info(`PDF download started for ${url}`);

    const response: FileResponse = await this.httpClient.getFileFromUrl(url);

    if (response.status !== 200) {
      throw new Error(
        'The PDF URL provided does not resolve with a 200 OK status',
      );
    }

    const pdfMimeType = mimeType.lookup('pdf');
    if (
      !response.contentType.toLowerCase().includes(pdfMimeType.toLowerCase())
    ) {
      throw new Error(
        'The URL provided does not reference a valid PDF document',
      );
    }

    this.logger.info(`Generating checksum for ${url}`);
    const checksum = await generateChecksum(response.content);

    this.logger.info(`Checksum generated. URL:: ${url}`);
    let document = await this.repository.findByCheckSum(checksum);
    let fileUrl: string;

    if (document) {
      this.logger.info(`Duplicate found for ${url}`);

      return {
        name: document.name,
        url: this.fileStorage.getURL(BUCKETS.PDF, `${document.name}.pdf`),
        isDuplicate: true,
      };
    } else {
      this.logger.info(`Downloading and saving document for ${url}`);

      document = await this.repository.createPdfDocument(checksum);
      await this.fileStorage.save(
        response.content,
        BUCKETS.PDF,
        `${document.name}.pdf`,
      );
      fileUrl = this.fileStorage.getURL(BUCKETS.PDF, `${document.name}.pdf`);
      this.logger.info(`PDF download finished for ${url}`);
      return { name: document.name, url: fileUrl, isDuplicate: false };
    }
  }

  /**
   * Converts the first page of the PDF with the associated ID to an image
   * and saves it.
   *
   * @param name
   * @param isDuplicate
   */
  public async generateThumbnail(name: string, isDuplicate: boolean) {
    this.logger.info(`Thumbnail generation started for ${name}`);

    if (isDuplicate) {
      // If it is a duplicate then the thumbnail has already been generated
      return this.fileStorage.getURL(BUCKETS.THUMBNAIL, `${name}.png`);
    }

    const stream = await this.fileStorage.read(BUCKETS.PDF, `${name}.pdf`);
    const thumbnailStream = await this.graphics.convertPdfPageToImage(
      stream,
      0,
    );
    await this.fileStorage.save(
      thumbnailStream,
      BUCKETS.THUMBNAIL,
      `${name}.png`,
    );

    const url = this.fileStorage.getURL(BUCKETS.THUMBNAIL, `${name}.png`);

    this.logger.info(`Thumbnail generation finished for ${name}`);
    return url;
  }

  async notifyWebhook(url: string, result: PdfDocumentResponse) {
    return this.httpClient.notifyWebhook(url, result);
  }
}
