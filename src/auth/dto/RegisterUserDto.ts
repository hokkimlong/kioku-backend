import { IsEmail, IsNotEmpty, Min } from 'class-validator';

export class RegisterUserDto {
  @Min(3)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
