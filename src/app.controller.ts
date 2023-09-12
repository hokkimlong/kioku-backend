import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ActivityMemberGuard } from './activity-member-guard/activity-member-guard.guard';
import { Public } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @Public()
  @UseGuards(ActivityMemberGuard)
  getHello(): any {
    return 'hello';
  }
}
