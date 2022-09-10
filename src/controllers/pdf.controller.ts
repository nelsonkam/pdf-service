import { Controller, Get } from 'routing-controllers';

@Controller()
export class PdfController {
  @Get('/')
  index() {
    return 'OK';
  }
}
