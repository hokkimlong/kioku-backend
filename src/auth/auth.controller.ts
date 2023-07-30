import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUserDto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
