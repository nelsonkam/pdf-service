import gm from 'gm';

import { GraphicsAdapter } from '@interfaces/graphics-adapter.interface';
import ReadableStream = NodeJS.ReadableStream;

export class GMGraphicsAdapter implements GraphicsAdapter {
  private gmClass: gm.SubClass = gm.subClass({ imageMagick: false });

  async convertPdfPageToImage(
    pdfFileStream: ReadableStream,
    page: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.gmClass(pdfFileStream)
        .selectFrame(page)
        .density(72, 72)
        .quality(0)
        .compress('JPEG')
        .toBuffer('png', (err, buffer) => {
          if (err) reject(err);
          resolve(buffer);
        });
    });
  }
}
