import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService, NotificationService],
})
export class PostModule {}
