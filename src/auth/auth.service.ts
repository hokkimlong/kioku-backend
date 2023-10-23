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
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifiyForgotPasswordDto,
} from './dto/forgot-password.dto';
import {
  generateForgotPasswordCode,
  isValidForgotPasswordToken,
  sendForgotPasswordMail,
  validateForgotPasswordCode,
} from './utils/send-forgot-password-mail';
import { RequestUser } from './utils/user-decorator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const foundUserEmail = await this.usersService.findByEmail(
      registerUserDto.email,
    );

    if (foundUserEmail)
      throw new NotFoundException({ message: 'email already exist' });

    const foundUserUsername = await this.usersService.findByUsername(
      registerUserDto.username,
    );

    if (foundUserUsername)
      throw new NotFoundException({ message: 'username already exist' });

    registerUserDto.password = await hashPassword(registerUserDto.password);
    const newUser = await this.usersService.createUser(registerUserDto);
    delete newUser.password;
    return newUser;
  }

  async login(loginUserDto: LoginUserDto) {
    const { identifier, password } = loginUserDto;

    const user = await this.usersService.findByEmailOrUsername(identifier);
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
        id,
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async getProfile(user: RequestUser) {
    const userProfile = await this.usersService.getUserById(user.id);
    return userProfile;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { identifier } = forgotPasswordDto;
    const user = await this.usersService.findByEmailOrUsername(identifier);
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const code = generateForgotPasswordCode(user.email);

    sendForgotPasswordMail(user.email, code);

    return {
      message: 'forgot password code sent to your email',
      identifier,
    };
  }

  async verifyForgotPasswordCode(
    verifiyForgotPasswordDto: VerifiyForgotPasswordDto,
  ) {
    const { identifier, code } = verifiyForgotPasswordDto;
    const user = await this.usersService.findByEmailOrUsername(identifier);
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const validToken = validateForgotPasswordCode(user.email, code);

    if (!validToken) {
      throw new UnauthorizedException({ message: 'invalid code' });
    }

    return {
      message: 'code verified',
      validToken,
      identifier,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.usersService.findByEmailOrUsername(
      resetPasswordDto.identifier,
    );
    if (!user) {
      throw new NotFoundException({ message: 'user not found' });
    }

    const isValidToken = isValidForgotPasswordToken(
      user.email,
      resetPasswordDto.token,
    );

    if (!isValidToken) {
      throw new UnauthorizedException({ message: 'invalid token' });
    }

    const newPassword = await hashPassword(resetPasswordDto.newPassword);

    await this.usersService.updatePassword(user.id, newPassword);

    return {
      message: 'password reset successfully',
    };
  }

  async editUsername(editUsernameDto: { username: string }, user: RequestUser) {
    const { username } = editUsernameDto;
    console.log('user', user);
    console.log('username', username);
    // const updatedUser = await this.usersService.updateUsername(
    //   user.id,
    //   username,
    // );
    // return updatedUser;
  }
}
