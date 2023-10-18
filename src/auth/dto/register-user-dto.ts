import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @MinLength(1)
  @Transform((param) => param.value.toLowerCase())
  username: string;

  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;
}
