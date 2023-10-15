import { Module } from '@nestjs/common';
import { InformationBoardService } from './information-board.service';
import { PrismaService } from 'src/prisma.service';
import { InformationBoardController } from './information-board.controller';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  providers: [InformationBoardService, PrismaService, NotificationService],
  controllers: [InformationBoardController],
})
export class InformationBoardModule {}
