import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): any {
    const data: Prisma.UserCreateInput = {
      username: 'kimlong',
      email: 'hokkimlong@outlook.com',
      password: 'kimlong',
    };
    const createdUser = this.prisma.user.create({ data });
    return createdUser;
  }
}
