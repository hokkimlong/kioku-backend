import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  activityId: number;
  @IsString()
  message: string;
}
