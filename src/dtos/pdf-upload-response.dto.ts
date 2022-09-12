import { IsString } from 'class-validator';

export class PdfUploadResponse {
  @IsString()
  message: string;
}
