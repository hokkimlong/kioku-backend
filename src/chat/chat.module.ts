import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService, NotificationService],
})
export class ChatModule {}
