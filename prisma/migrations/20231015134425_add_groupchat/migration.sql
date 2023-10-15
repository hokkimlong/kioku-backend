-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "GroupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
