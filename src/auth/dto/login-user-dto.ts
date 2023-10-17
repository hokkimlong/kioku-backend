import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @Transform((param) => param.value.toLowerCase())
  identifier: string;

  @IsNotEmpty()
  password: string;
}
