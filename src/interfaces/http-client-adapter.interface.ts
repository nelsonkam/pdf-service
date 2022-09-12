export interface FileResponse {
  status: number;
  content: Buffer;
  contentType: string;
}
export interface HttpClientAdapter {
  getFileFromUrl(url: string): Promise<FileResponse>;
}
