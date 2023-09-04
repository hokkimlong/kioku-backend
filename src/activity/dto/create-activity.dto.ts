import { IsArray, IsDateString, IsString, MinLength } from 'class-validator';

export class CreateActivityDto {
  @MinLength(3)
  name: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsString()
  image: string;

  @IsArray()
  members: Member[];
}

class Member {
  id: number;
}
