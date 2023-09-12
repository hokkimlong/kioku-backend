import { IsArray, IsNumber, IsString } from 'class-validator';
import { Image } from 'src/post/dto/create-post.dto';

export class CreateInformationBoardDto {
  @IsNumber()
  activityId: number;

  @IsArray()
  images: Image[];

  @IsString()
  title: string;

  @IsString()
  description: string;
}
