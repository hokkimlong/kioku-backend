import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { PrismaService } from 'src/prisma.service';
import { PostService } from 'src/post/post.service';
import { InformationBoardService } from 'src/information-board/information-board.service';
import { ChatService } from 'src/chat/chat.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    PrismaService,
    NotificationService,
    PostService,
    InformationBoardService,
    ChatService,
  ],
})
export class ActivityModule {}
