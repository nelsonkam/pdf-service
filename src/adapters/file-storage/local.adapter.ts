import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import * as fs from 'fs';
import path from 'path';
import { APP_URL, UPLOADS_DIR } from '@config';
import { STATIC_FILES_ENDPOINT } from '@utils/constants';

export class LocalFileStorageAdapter implements FileStorageAdapter {
  /**
   * Given some file content in Buffer format, bucket and key, this method saves the
   * content to the local filesystem.
   *
   * @param content
   * @param bucket
   * @param key
   */
  async save(content: Buffer, bucket: string, key: string): Promise<void> {
    const folder = path.join(UPLOADS_DIR, bucket);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFileSync(path.join(folder, key), content);
  }

  /**
   * Given a bucket and key, returns a URL pointing to the file.
   *
   * @param bucket
   * @param key
   */
  getURL(bucket: string, key: string): string {
    return new URL(
      `${STATIC_FILES_ENDPOINT}/${bucket}/${key}`,
      APP_URL,
    ).toString();
  }

  /**
   * Given a bucket and key, returns a ReadableStream of the file's content.
   *
   * @param bucket
   * @param key
   */
  async read(bucket: string, key: string): Promise<NodeJS.ReadableStream> {
    const folder = path.join(UPLOADS_DIR, bucket);
    return fs.createReadStream(path.join(folder, key));
  }
}
