import axios from 'axios';
import * as mimeType from 'mime-types';
import { Stream } from 'stream';

import {
  FileStreamResponse,
  HttpClientAdapter,
} from '@interfaces/http-client-adapter.interface';

export class AxiosHttpClientAdapter implements HttpClientAdapter {
  async getFileFromUrl(url: string): Promise<FileStreamResponse> {
    const response = await axios.get<Stream>(url, { responseType: 'stream' });

    return {
      status: response.status,
      fileStream: response.data,
      mimeType: mimeType.contentType(response.headers['content-type']),
    };
  }
}
