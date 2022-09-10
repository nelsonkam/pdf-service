import { Body, JsonController, Post, UseBefore } from 'routing-controllers';
import { validationMiddleware } from '@middlewares/validation.middleware';
import { PdfUploadDto } from '@dtos/pdf-upload.dto';
import { PdfService } from '@services/pdf.service';

@JsonController()
export class PdfController {
  private service = new PdfService();

  @Post('/')
  @UseBefore(validationMiddleware(PdfUploadDto, 'body'))
  async uploadPDF(@Body() dto: PdfUploadDto) {
    return this.service.preProcessPdf(dto);
  }
}
