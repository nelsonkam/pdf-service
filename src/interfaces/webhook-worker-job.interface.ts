import { PdfDocumentResponse } from '@dtos/pdf-document-response.dto';

export interface WebhookWorkerJob {
  url: string;
  result: PdfDocumentResponse;
}
