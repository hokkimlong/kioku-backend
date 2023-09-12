/*
  Warnings:

  - You are about to drop the column `background` on the `Information` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `InformationImage` table. All the data in the column will be lost.
  - Added the required column `uri` to the `InformationImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Information" DROP COLUMN "background";

-- AlterTable
ALTER TABLE "InformationImage" DROP COLUMN "image",
ADD COLUMN     "uri" TEXT NOT NULL;
