import App from '@/app';
import { PdfController } from '@controllers/pdf.controller';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([PdfController]);
app.listen();
