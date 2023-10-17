import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @Transform((param) => param.value.toLowerCase())
  identifier: string;
}

export class VerifiyForgotPasswordDto extends ForgotPasswordDto {
  @IsNotEmpty()
  code: string;
}

export class ResetPasswordDto extends ForgotPasswordDto {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  newPassword: string;
}
