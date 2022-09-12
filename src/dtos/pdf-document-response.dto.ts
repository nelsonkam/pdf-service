import { IsString, IsUrl } from 'class-validator';

export class PdfDocumentResponse {
  @IsString()
  @IsUrl()
  pdf: string;

  @IsString()
  @IsUrl()
  thumbnail: string;
}
