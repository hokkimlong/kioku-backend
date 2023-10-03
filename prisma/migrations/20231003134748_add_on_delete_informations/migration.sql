-- DropForeignKey
ALTER TABLE "InformationImage" DROP CONSTRAINT "InformationImage_informationId_fkey";

-- AddForeignKey
ALTER TABLE "InformationImage" ADD CONSTRAINT "InformationImage_informationId_fkey" FOREIGN KEY ("informationId") REFERENCES "Information"("id") ON DELETE CASCADE ON UPDATE CASCADE;
