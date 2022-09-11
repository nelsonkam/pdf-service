import { PrismaClient } from '@prisma/client';

export class PdfDocumentRepository {
  private client = new PrismaClient();

  async createPdfDocument(checksum: string) {
    const document = await this.client.pdfDocument.create({
      data: { checksum },
    });
    return document;
  }

  async findByCheckSum(checksum: string) {
    return await this.client.pdfDocument.findUnique({
      where: {
        checksum,
      },
    });
  }

  async findAll() {
    return this.client.pdfDocument.findMany();
  }
}
