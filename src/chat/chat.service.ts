import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RequestUser } from 'src/auth/utils/user-decorator';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async getChatByActivityId(activityId: number) {
    return await this.prisma.groupChat.findMany({
      where: {
        activityId,
      },
      include: {
        user: true,
      },
    });
  }

  async sendMessageToChat(
    user: RequestUser,
    createMessageDto: CreateMessageDto,
  ) {
    const activityUsers = await this.prisma.activityUsers.findMany({
      where: {
        activityId: createMessageDto.activityId,
        userId: {
          not: user.id,
        },
      },
    });

    await this.notificationService.createNewGroupChatNotification(
      {
        activityId: createMessageDto.activityId,
      },
      { id: user.id, username: user.username },
      activityUsers.map((activityUser) => ({
        id: activityUser.userId,
      })),
    );

    return await this.prisma.groupChat.create({
      data: {
        activityId: createMessageDto.activityId,
        message: createMessageDto.message,
        userId: user.id,
      },
    });
  }
}
