import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  getUsers(@User() user: RequestUser, @Query('search') search: string) {
    return this.userService.getUsers(user.id, search);
  }

  @Delete('/delete')
  deleteUser(@User() user: RequestUser) {
    console.log('delete', user);
    return this.userService.deleteUser(user.id);
  }

  @Post('/')
  updateUsers(@User() user: RequestUser, @Body() body: any) {
    return this.userService.updateProfile(user.id, body);
  }
}
