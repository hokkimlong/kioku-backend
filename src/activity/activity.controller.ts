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

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly postService: PostService,
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Get(':id/post')
  getActivityPosts(@Param('id', ParseIntPipe) activityId: number) {
    return this.postService.getPostsByActivityId(activityId);
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

  @Get(':id/post')
  getActivityInformations(@Param('id', ParseIntPipe) activityId: number) {
    return;
  }
}
