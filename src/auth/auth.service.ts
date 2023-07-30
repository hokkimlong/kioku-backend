import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from './dto/registerUserDto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/LoginUserDto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  register(registerUserDto: RegisterUserDto) {
    return this.usersService.createUser(registerUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (user?.password === password) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id };
  }
}
