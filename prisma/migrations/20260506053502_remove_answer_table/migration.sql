/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_ticketId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "rawAnswer" JSONB NOT NULL DEFAULT '{}';

-- DropTable
DROP TABLE "Answer";
