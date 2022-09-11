import gm from 'gm';

import { GraphicsAdapter } from '@interfaces/graphics-adapter.interface';
import { Stream } from 'stream';
import ReadableStream = NodeJS.ReadableStream;

export class GMGraphicsAdapter implements GraphicsAdapter {
  private gmClass: gm.SubClass = gm.subClass({ imageMagick: false });

  async convertPdfPageToImage(
    pdfFileStream: ReadableStream,
    page: number,
  ): Promise<Stream> {
    return this.gmClass(pdfFileStream)
      .selectFrame(page)
      .density(72, 72)
      .quality(0)
      .compress('JPEG')
      .stream('png');
  }
}
