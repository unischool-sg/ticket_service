/*
  Warnings:

  - You are about to drop the column `idx` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "idx",
ALTER COLUMN "num" DROP DEFAULT,
ALTER COLUMN "num" SET DATA TYPE TEXT;
DROP SEQUENCE "Ticket_num_seq";
