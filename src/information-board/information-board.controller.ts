import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { RequestUser, User } from 'src/auth/utils/user-decorator';
import { CreateInformationBoardDto } from './dto/create-post.dto';
import { InformationBoardService } from './information-board.service';

@Controller('information-board')
export class InformationBoardController {
  constructor(private readonly informationService: InformationBoardService) {}

  @Post()
  createActivityInformation(
    @User() user: RequestUser,
    @Body() createInformationBoardDto: CreateInformationBoardDto,
  ) {
    return this.informationService.create(user, createInformationBoardDto);
  }

  @Get(':id')
  findActivityInformationById(@Param('id', ParseIntPipe) id: number) {
    return this.informationService.getInformationBoardById(id);
  }

  @Delete(':id')
  deleteActivityInformationById(@Param('id', ParseIntPipe) id: number) {
    return this.informationService.deleteInformationBoardById(id);
  }

  @Post(':id')
  updateInformationBoardById(
    @Param('id', ParseIntPipe) id: number,
    @Body() createInformationBoardDto: CreateInformationBoardDto,
  ) {
    return this.informationService.updateInformationBoardById(
      id,
      createInformationBoardDto,
    );
  }
}
