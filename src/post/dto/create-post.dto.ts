import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  activityId: number;

  @IsArray()
  images: Image[];

  @IsString()
  description: string;
}

export class Image {
  uri: string;
}
