import { Controller, Get } from '@nestjs/common';
import { InformationBoardService } from './information-board.service';

@Controller('information-board')
export class InformationBoardController {
  constructor(private informationService: InformationBoardService) {}
}
