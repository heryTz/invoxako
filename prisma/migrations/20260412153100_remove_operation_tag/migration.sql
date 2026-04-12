/*
  Warnings:

  - You are about to drop the `Operation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OperationToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropForeignKey
ALTER TABLE "_OperationToTag" DROP CONSTRAINT "_FinanceToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_OperationToTag" DROP CONSTRAINT "_FinanceToTag_B_fkey";

-- DropTable
DROP TABLE "Operation";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_OperationToTag";
