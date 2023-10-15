/*
  Warnings:

  - You are about to drop the column `groupChatId` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `informationId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_groupChatId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "groupChatId",
ADD COLUMN     "informationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "Information"("id") ON DELETE CASCADE ON UPDATE CASCADE;
