-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "invoiceSeq" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientSeq" INTEGER NOT NULL DEFAULT 0;
