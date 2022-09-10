import { Stream } from 'stream';

export interface FileStreamResponse {
  status: number;
  fileStream: Stream;
  mimeType: string;
}
export interface HttpClientAdapter {
  getFileFromUrl(url: string): Promise<FileStreamResponse>;
}
