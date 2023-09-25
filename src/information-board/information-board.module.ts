import { Module } from '@nestjs/common';
import { InformationBoardService } from './information-board.service';
import { PrismaService } from 'src/prisma.service';
import { InformationBoardController } from './information-board.controller';

@Module({
  providers: [InformationBoardService, PrismaService],
  controllers: [InformationBoardController],
})
export class InformationBoardModule {}
