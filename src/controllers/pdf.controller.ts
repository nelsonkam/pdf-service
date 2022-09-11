import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
  UseBefore,
} from 'routing-controllers';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import { PdfService } from '@services/pdf.service';
import { FileStorageService } from '@services/file-storage.service';
import { queues } from '@utils/queue';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';

@JsonController()
export class PdfController {
  private readonly service: PdfService;

  constructor() {
    this.service = new PdfService(
      new FileStorageService(),
      queues.pdfQueue,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
      new PdfDocumentRepository(),
    );
  }

  @Post('/document')
  @HttpCode(202)
  @UseBefore(validationMiddleware(PdfUploadDto, 'body'))
  async uploadPDF(@Body() dto: PdfUploadDto) {
    await this.service.preProcessPdf(dto);
    return { message: 'OK' };
  }

  @Get('/documents')
  @HttpCode(200)
  async getDocumentList() {
    return await this.service.getDocuments();
  }
}
