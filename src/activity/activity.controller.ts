import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { User, RequestUser } from 'src/auth/utils/user-decorator';
import { PostService } from 'src/post/post.service';
import { InformationBoardService } from 'src/information-board/information-board.service';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly postService: PostService,
    private readonly informationService: InformationBoardService,
  ) {}

  @Post()
  create(
    @User() user: RequestUser,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.activityService.createActivity(+user.id, createActivityDto);
  }

  @Get()
  getActivities(@User() user: RequestUser) {
    return this.activityService.getActivitiesByUserId(+user.id);
  }

  @Get(':id/post')
  getActivityPosts(@Param('id', ParseIntPipe) activityId: number) {
    console.log('run');
    return this.postService.getPostsByActivityId(activityId);
  }

  @Get(':id/information')
  getActivityInformations(@Param('id', ParseIntPipe) activityId: number) {
    return this.informationService.getInformationBoardByActivityId(activityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
