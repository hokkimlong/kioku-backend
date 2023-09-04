import { Controller, Post, Body } from '@nestjs/common';
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
}
