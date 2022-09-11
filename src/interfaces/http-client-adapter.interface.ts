export interface FileResponse {
  status: number;
  content: Buffer;
  mimeType: string;
}
export interface HttpClientAdapter {
  getFileFromUrl(url: string): Promise<FileResponse>;
}
