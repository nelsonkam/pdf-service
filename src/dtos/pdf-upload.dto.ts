import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class PdfUploadDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsUrl()
  @IsOptional()
  webhookUrl?: string;
}
