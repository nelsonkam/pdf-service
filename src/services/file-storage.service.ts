import axios from 'axios';
import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import { LocalFileStorageAdapter } from '@/adapters/file-storage/local.adapter';
import { FILE_STORAGE_ENGINE } from '@config';
import { FileStorageEngine } from '@utils/constants';

export class FileStorageService {
  private get fileStorageAdapter(): FileStorageAdapter {
    if (FILE_STORAGE_ENGINE === FileStorageEngine.LOCAL) {
      return new LocalFileStorageAdapter();
    }
    return new LocalFileStorageAdapter();
  }

  public async downloadFile(url: string, bucket: string, fileName: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'stream' });

    await this.fileStorageAdapter.save(response.data, bucket, fileName);

    return await this.fileStorageAdapter.retrieve(bucket, fileName);
  }
}
