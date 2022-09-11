import { Stream } from 'stream';
import ReadableStream = NodeJS.ReadableStream;

export interface GraphicsAdapter {
  convertPdfPageToImage(
    pdfFileStream: ReadableStream,
    page: number,
  ): Promise<Stream>;
}
