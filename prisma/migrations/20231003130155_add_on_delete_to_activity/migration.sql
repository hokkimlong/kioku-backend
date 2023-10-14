-- DropForeignKey
ALTER TABLE "ActivityUsers" DROP CONSTRAINT "ActivityUsers_activityId_fkey";

-- DropForeignKey
ALTER TABLE "GroupChat" DROP CONSTRAINT "GroupChat_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Information" DROP CONSTRAINT "Information_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_activityId_fkey";

-- AddForeignKey
ALTER TABLE "ActivityUsers" ADD CONSTRAINT "ActivityUsers_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Information" ADD CONSTRAINT "Information_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
