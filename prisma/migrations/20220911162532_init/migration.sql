-- CreateTable
CREATE TABLE "PdfDocument" (
    "name" TEXT NOT NULL,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PdfDocument_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "PdfDocument_checksum_key" ON "PdfDocument"("checksum");
