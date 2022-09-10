import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import { LocalFileStorageAdapter } from '@/adapters/file-storage/local.adapter';
import { FILE_STORAGE_ENGINE } from '@config';
import { FileStorageEngine } from '@utils/constants';
import { Stream } from 'stream';

export class FileStorageService {
  private get fileStorageAdapter(): FileStorageAdapter {
    if (FILE_STORAGE_ENGINE === FileStorageEngine.LOCAL) {
      return new LocalFileStorageAdapter();
    }
    return new LocalFileStorageAdapter();
  }

  public async downloadFile(stream: Stream, bucket: string, fileName: string): Promise<string> {
    await this.fileStorageAdapter.save(stream, bucket, fileName);

    return await this.fileStorageAdapter.retrieve(bucket, fileName);
  }
}
