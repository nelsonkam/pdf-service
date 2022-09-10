import { IsNotEmpty, IsUrl } from 'class-validator';

export class PdfUploadDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
