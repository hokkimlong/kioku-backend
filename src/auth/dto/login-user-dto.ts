import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  password: string;
}
