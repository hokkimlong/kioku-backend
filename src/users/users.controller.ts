import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  getUsers(@User() user: RequestUser) {
    return this.userService.getUsers(user.id);
  }
}
