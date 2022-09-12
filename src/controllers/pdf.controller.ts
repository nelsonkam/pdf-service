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
import { queues } from '@utils/queue';
import { AxiosHttpClientAdapter } from '@adapters/http-client/axios.adapter';
import { GMGraphicsAdapter } from '@adapters/graphics/gm.adapter';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { PdfDocumentResponse } from '@dtos/pdf-document-response.dto';
import { PdfUploadResponse } from '@dtos/pdf-upload-response.dto';
import { LocalFileStorageAdapter } from '@adapters/file-storage/local.adapter';

@JsonController('/v1')
export class PdfController {
  private readonly service: PdfService;

  constructor() {
    this.service = new PdfService(
      queues.pdf,
      new AxiosHttpClientAdapter(),
      new GMGraphicsAdapter(),
      new PdfDocumentRepository(),
      new LocalFileStorageAdapter(),
    );
  }

  @Post('/document')
  @HttpCode(202)
  @ResponseSchema(PdfUploadResponse)
  @OpenAPI({ summary: 'Store a PDF document' })
  @UseBefore(validationMiddleware(PdfUploadDto, 'body'))
  async uploadPDF(@Body() dto: PdfUploadDto) {
    await this.service.preProcessPdf(dto);
    return { message: 'OK' };
  }

  @Get('/documents')
  @ResponseSchema(PdfDocumentResponse, { isArray: true })
  @OpenAPI({ summary: 'Get list of stored PDF documents and their thumbnails' })
  @HttpCode(200)
  async getDocumentList() {
    return await this.service.getDocuments();
  }
}
