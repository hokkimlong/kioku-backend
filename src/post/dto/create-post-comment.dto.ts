import { IsNumber, IsString } from 'class-validator';

export class CreatePostCommentDto {
  @IsNumber()
  postId: number;

  @IsString()
  message: string;
}
