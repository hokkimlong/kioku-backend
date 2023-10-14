import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';

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

  @Post('comment')
  createPostComment(
    @User() user: RequestUser,
    @Body() createPostCommentDto: CreatePostCommentDto,
  ) {
    return this.postService.createComment(user.id, createPostCommentDto);
  }

  @Delete('comment/:id')
  deletePostComment(@Param('id', ParseIntPipe) commentId) {
    return this.postService.deleteComment(commentId);
  }
}
