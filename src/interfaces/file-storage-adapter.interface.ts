import { Stream } from 'stream';

export interface FileStorageAdapter {
  save(stream: Stream, bucket: string, key: string): Promise<void>;
  retrieve(bucket: string, key: string): Promise<string>;
  read(bucket: string, key: string): Promise<NodeJS.ReadableStream>;
}
