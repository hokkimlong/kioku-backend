import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user-dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { Public } from './auth.guard';
import { RequestUser, User } from './utils/user-decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.login(loginUserDto);
  }

  @Get('profile')
  getProfile(@User() user: RequestUser) {
    return user;
  }
}
