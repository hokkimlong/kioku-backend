import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  createPosts(@User() user: RequestUser, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(user.id, createPostDto);
  }

  @Post(':id')
  likePost(@User() user: RequestUser, @Param('id', ParseIntPipe) postId) {
    return this.postService.likePost(user.id, postId);
  }
}
