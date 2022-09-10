import { Body, JsonController, Post, UseBefore } from 'routing-controllers';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import { PdfService } from '@services/pdf.service';
import { OpenAPI } from 'routing-controllers-openapi';

@JsonController()
export class PdfController {
  private service = new PdfService();

  @Post('/')
  @UseBefore(validationMiddleware(PdfUploadDto, 'body'))
  @OpenAPI({ summary: 'Return a list of users' })
  async uploadPDF(@Body() dto: PdfUploadDto) {
    return this.service.preProcessPdf(dto);
  }
}
