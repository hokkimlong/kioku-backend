import { Module } from '@nestjs/common';
import { InformationBoardController } from './information-board.controller';
import { InformationBoardService } from './information-board.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [InformationBoardController],
  providers: [InformationBoardService, PrismaService],
})
export class InformationBoardModule {}
