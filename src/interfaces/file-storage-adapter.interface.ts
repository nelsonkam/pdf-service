export interface FileStorageAdapter {
  save(content: Buffer, bucket: string, key: string): Promise<void>;
  getURL(bucket: string, key: string): string;
  read(bucket: string, key: string): Promise<NodeJS.ReadableStream>;
}
