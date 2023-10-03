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
import { ChatService } from 'src/chat/chat.service';

@Controller('activity')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly postService: PostService,
    private readonly informationService: InformationBoardService,
    private readonly chatService: ChatService,
  ) {}

  // Post

  @Post()
  create(
    @User() user: RequestUser,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.activityService.createActivity(+user.id, createActivityDto);
  }

  // GET

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

  @Get(':id/information')
  getActivityInformations(@Param('id', ParseIntPipe) activityId: number) {
    return this.informationService.getInformationBoardByActivityId(activityId);
  }

  @Get(':id/chat')
  getActivityChats(@Param('id', ParseIntPipe) activityId: number) {
    return this.chatService.getChatByActivityId(activityId);
  }

  // Patch

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.update(+id, updateActivityDto);
  }

  // Delete

  @Delete(':id')
  removeActivity(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }
}
