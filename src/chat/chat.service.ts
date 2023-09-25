import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

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

  async sendMessageToChat(userId: number, createMessageDto: CreateMessageDto) {
    return await this.prisma.groupChat.create({
      data: {
        activityId: createMessageDto.activityId,
        message: createMessageDto.message,
        userId,
      },
    });
  }
}
