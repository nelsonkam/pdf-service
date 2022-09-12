export interface FileResponse {
  status: number;
  content: Buffer;
  contentType: string;
}
export interface HttpClientAdapter {
  getFileFromUrl(url: string): Promise<FileResponse>;
  notifyWebhook<T>(url: string, data: T): Promise<{ statusCode: number }>;
}
