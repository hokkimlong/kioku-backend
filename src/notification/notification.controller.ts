import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from './notification.service';
import { RequestUser, User } from 'src/auth/utils/user-decorator';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getNotificationByUserId(@User() user: RequestUser) {
    return this.notificationService.getNotificationByUserId(user.id);
  }
}
