import { PdfService } from '@services/pdf.service';
import { FileStorageService } from '@services/file-storage.service';
import { mock } from 'jest-mock-extended';
import { Queue } from 'bullmq';
import { faker } from '@faker-js/faker';
import { HttpClientAdapter } from '@interfaces/http-client-adapter.interface';
import { Stream } from 'stream';
import * as mimeType from 'mime-types';

describe('PdfService', () => {
  const fileStorageService = mock<FileStorageService>();
  const pdfQueue = mock<Queue>();
  const httpClient = mock<HttpClientAdapter>();
  const service = new PdfService(fileStorageService, pdfQueue, httpClient);

  describe('PdfService.preProcessPdf', () => {
    it('should return immediately with an ID', async () => {
      const input = {
        url: faker.internet.url(),
      };

      const result = await service.preProcessPdf(input);

      expect(pdfQueue.add).toBeCalledWith(expect.any(String), {
        id: expect.any(String),
        url: input.url,
      });
      expect(result.id).toBeTruthy();
    });
  });

  describe('PdfService.downloadPdf', () => {
    it('should throw an error if response is not 200 OK', async () => {
      const id = faker.datatype.uuid();
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockResolvedValue({
        status: 404,
        fileStream: new Stream(),
        mimeType: '',
      });

      await expect(service.downloadPdf(id, url)).rejects.toThrowError('The PDF URL provided does not resolve with a 200 OK status');
    });

    it('should throw an error if mimeType is incorrect', async () => {
      const id = faker.datatype.uuid();
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockResolvedValue({
        status: 200,
        fileStream: new Stream(),
        mimeType: 'image/png',
      });

      await expect(service.downloadPdf(id, url)).rejects.toThrowError('The URL provided does not reference a valid PDF document');
    });

    it('should run without errors', async () => {
      const id = faker.datatype.uuid();
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockResolvedValue({
        status: 200,
        fileStream: new Stream(),
        mimeType: mimeType.lookup('pdf'),
      });
      fileStorageService.downloadFile.mockResolvedValue(faker.internet.url());

      const result = await service.downloadPdf(id, url);

      expect(result.id).toBeTruthy();
      expect(result.url).toBeTruthy();
    });
  });
});
