import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';
import { finished, Stream } from 'stream';
import * as fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { APP_URL, UPLOADS_DIR } from '@config';
import { STATIC_FILES_ENDPOINT } from '@utils/constants';

const streamFinished = promisify(finished);

export class LocalFileStorageAdapter implements FileStorageAdapter {
  /**
   * Given a stream, bucket and key, this method saves the
   * stream to the local filesystem.
   *
   * @param stream
   * @param bucket
   * @param key
   */
  async save(stream: Stream, bucket: string, key: string): Promise<void> {
    const folder = path.join(UPLOADS_DIR, bucket);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const localFileStream = fs.createWriteStream(path.join(folder, key));
    stream.pipe(localFileStream);
    await streamFinished(localFileStream);
  }

  /**
   * Given a bucket and key, returns a URL pointing to the file.
   *
   * @param bucket
   * @param key
   */
  async retrieve(bucket: string, key: string): Promise<string> {
    return new URL(`${STATIC_FILES_ENDPOINT}/${bucket}/${key}`, APP_URL).toString();
  }
}
