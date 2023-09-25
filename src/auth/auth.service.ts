import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user-dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, verifyPassword } from 'src/auth/utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    registerUserDto.password = await hashPassword(registerUserDto.password);
    const newUser = await this.usersService.createUser(registerUserDto);
    delete newUser.password;
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }
    const isPasswordMatch = await verifyPassword(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException({ message: 'password not match' });
    }

    {
      const { id, username, email } = user;
      const payload = { id, username, email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
