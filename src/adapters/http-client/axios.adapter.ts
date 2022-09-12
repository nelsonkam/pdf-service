import axios from 'axios';

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
      contentType: response.headers['content-type'],
    };
  }

  async notifyWebhook<T>(
    url: string,
    data: T,
  ): Promise<{ statusCode: number }> {
    const response = await axios.post(url, data);
    return { statusCode: response.status };
  }
}
