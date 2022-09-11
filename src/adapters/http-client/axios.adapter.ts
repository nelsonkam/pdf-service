import axios from 'axios';
import * as mimeType from 'mime-types';

import {
  FileResponse,
  HttpClientAdapter,
} from '@interfaces/http-client-adapter.interface';

export class AxiosHttpClientAdapter implements HttpClientAdapter {
  async getFileFromUrl(url: string): Promise<FileResponse> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    return {
      status: response.status,
      content: Buffer.from(response.data),
      mimeType: mimeType.contentType(response.headers['content-type']),
    };
  }
}
