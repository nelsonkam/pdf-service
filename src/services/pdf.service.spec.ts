import { PdfService } from '@services/pdf.service';
import { mock } from 'jest-mock-extended';
import { Queue } from 'bullmq';
import { faker } from '@faker-js/faker';
import { HttpClientAdapter } from '@interfaces/http-client-adapter.interface';
import * as contentType from 'mime-types';
import { GraphicsAdapter } from '@interfaces/graphics-adapter.interface';
import { PdfDocumentRepository } from '@/repositories/pdf-document.repository';
import { FileStorageAdapter } from '@interfaces/file-storage-adapter.interface';

describe('PdfService', () => {
  const fileStorage = mock<FileStorageAdapter>();
  const pdfQueue = mock<Queue>();
  const httpClient = mock<HttpClientAdapter>();
  const graphics = mock<GraphicsAdapter>();
  const repository = mock<PdfDocumentRepository>();
  const service = new PdfService(
    pdfQueue,
    httpClient,
    graphics,
    repository,
    fileStorage,
  );

  describe('PdfService.preProcessPdf', () => {
    it('should return immediately with an ID', async () => {
      const input = {
        url: faker.internet.url(),
      };

      await service.preProcessPdf(input);

      expect(pdfQueue.add).toBeCalledWith(expect.any(String), {
        url: input.url,
      });
    });
  });

  describe('PdfService.downloadPdf', () => {
    it('should throw an error if response is not 200 OK', async () => {
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockReturnValueOnce(
        Promise.resolve({
          status: 404,
          content: Buffer.from('test'),
          contentType: '',
        }),
      );

      await expect(service.downloadPdf(url)).rejects.toThrowError(
        'The PDF URL provided does not resolve with a 200 OK status',
      );
    });

    it('should throw an error if contentType is incorrect', async () => {
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          content: Buffer.from('test'),
          contentType: 'image/png',
        }),
      );

      await expect(service.downloadPdf(url)).rejects.toThrowError(
        'The URL provided does not reference a valid PDF document',
      );
    });

    it('should return the existing file if the url is a duplicate', async () => {
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          content: Buffer.from('test'),
          contentType: contentType.lookup('pdf'),
        }),
      );

      repository.findByCheckSum.mockReturnValueOnce(
        Promise.resolve({
          name: faker.system.fileName(),
          checksum: faker.datatype.string(),
          createdAt: faker.datatype.datetime(),
        }),
      );

      fileStorage.getURL
        .mockReturnValueOnce(faker.internet.url())
        .mockReturnValueOnce(faker.internet.url());

      const result = await service.downloadPdf(url);

      expect(result.name).toBeTruthy();
      expect(result.url).toBeTruthy();
      expect(result.isDuplicate).toBeTruthy();
    });

    it('should run without errors', async () => {
      const url = faker.internet.url();
      httpClient.getFileFromUrl.mockReturnValueOnce(
        Promise.resolve({
          status: 200,
          content: Buffer.from('test'),
          contentType: contentType.lookup('pdf'),
        }),
      );
      fileStorage.getURL.mockReturnValueOnce(faker.internet.url());
      repository.createPdfDocument.mockReturnValueOnce(
        Promise.resolve({
          name: faker.system.fileName(),
          checksum: faker.datatype.string(),
          createdAt: faker.datatype.datetime(),
        }),
      );

      const result = await service.downloadPdf(url);

      expect(result.name).toBeTruthy();
      expect(result.url).toBeTruthy();
      expect(result.isDuplicate).toBeFalsy();
    });
  });

  describe('PdfService.generateThumbnail', () => {
    it('should generate a thumbnail without errors', async () => {
      const result = await service.generateThumbnail(faker.datatype.uuid());
      expect(result).toBeTruthy();
      expect(fileStorage.read).toHaveBeenCalled();
      expect(graphics.convertPdfPageToImage).toHaveBeenCalled();
      expect(fileStorage.save).toHaveBeenCalled();
    });
  });

  describe('PdfService.getDocuments', () => {
    it('should return all documents without errors', async () => {
      repository.findAll.mockReturnValueOnce(
        Promise.resolve([
          {
            name: faker.system.fileName(),
            checksum: faker.datatype.string(),
            createdAt: faker.datatype.datetime(),
          },
        ]),
      );
      fileStorage.getURL
        .mockReturnValueOnce(faker.internet.url())
        .mockReturnValueOnce(faker.internet.url());
      const result = await service.getDocuments();
      expect(result).toBeTruthy();
      expect(result).toEqual([
        { pdf: expect.any(String), thumbnail: expect.any(String) },
      ]);
    });
  });
});
