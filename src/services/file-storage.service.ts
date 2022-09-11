import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import { LocalFileStorageAdapter } from '@/adapters/file-storage/local.adapter';
import { FILE_STORAGE_ENGINE } from '@config';
import { FileStorageEngine } from '@utils/constants';
import * as crypto from 'crypto';

export class FileStorageService {
  private get fileStorageAdapter(): FileStorageAdapter {
    if (FILE_STORAGE_ENGINE === FileStorageEngine.LOCAL) {
      return new LocalFileStorageAdapter();
    }
    return new LocalFileStorageAdapter();
  }

  public async downloadFile(
    content: Buffer,
    bucket: string,
    fileName: string,
  ): Promise<string> {
    await this.fileStorageAdapter.save(content, bucket, fileName);

    return this.fileStorageAdapter.getURL(bucket, fileName);
  }

  public getFileURL(bucket: string, fileName: string): string {
    return this.fileStorageAdapter.getURL(bucket, fileName);
  }

  public async readFile(
    bucket: string,
    fileName: string,
  ): Promise<NodeJS.ReadableStream> {
    return this.fileStorageAdapter.read(bucket, fileName);
  }

  public async generateChecksum(content: Buffer): Promise<string> {
    const hash = crypto.createHash('sha1');
    hash.update(content);
    return hash.digest('hex');
  }
}
