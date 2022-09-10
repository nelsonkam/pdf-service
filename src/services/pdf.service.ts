import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import axios from 'axios';
import * as crypto from 'crypto';
import * as mimeType from 'mime-types';
import { ScopedLogger } from '@utils/logger';
import { HttpException } from '@exceptions/HttpException';

export class PdfService {
  private logger = new ScopedLogger(PdfService.name);
  public async preProcessPdf(dto: PdfUploadDto): Promise<{ id: string }> {
    this.logger.info('PDF preprocessing started');

    await this.validateURL(dto.url);
    return { id: crypto.randomUUID() };
  }

  private async validateURL(url: string) {
    let response;

    try {
      response = await axios.get(url);
    } catch (err) {
      this.logger.error(`Error encountered while validating >> URL:: ${url}. Error:: ${err.message}`);
      throw new HttpException(400, "We couldn't resolve the URL provided");
    }

    console.log(response.data);

    if (response.status !== 200) {
      throw new HttpException(400, 'The PDF URL provided does not resolve with a 200 OK status');
    }

    const pdfMimeType = mimeType.lookup('pdf');
    if (mimeType.contentType(response.headers['content-type']) !== pdfMimeType) {
      throw new HttpException(400, 'The URL provided does not reference a valid PDF document');
    }
  }
}
