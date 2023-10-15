import { Injectable } from '@nestjs/common';
import { RequestUser } from 'src/auth/utils/user-decorator';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotificationByUserId(userId: number) {
    const unSeenCount = await this.prisma.notification.count({
      where: {
        receiverId: userId,
        isSeen: false,
      },
    });
    const result = await this.prisma.notification.findMany({
      where: {
        receiverId: userId,
      },
      include: {
        sender: true,
        activity: true,
      },
    });
    return {
      unSeenCount,
      data: result,
    };
  }

  async markAsSeen(userId: number) {
    return this.prisma.notification.updateMany({
      data: {
        isSeen: true,
      },
      where: {
        receiverId: userId,
        isSeen: false,
      },
    });
  }

  _createNotification(data: any, sender: RequestUser, receiver: RequestUser[]) {
    const { message, activityId } = data;

    return this.prisma.notification.createMany({
      data: receiver.map((user) => ({
        message,
        activityId,
        senderId: sender.id,
        receiverId: user.id,
        ...data,
      })),
    });
  }

  createNewActivityNotification(
    data: {
      activityId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    return this._createNotification(
      {
        message: `${sender.username} created a new activity`,
        activityId: data.activityId,
      },
      sender,
      receiver,
    );
  }

  createNewPostNotification(
    data: {
      activityId: number;
      postId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    return this._createNotification(
      {
        message: `${sender.username} created a new post`,
        activityId: data.activityId,
        postId: data.postId,
      },
      sender,
      receiver,
    );
  }

  createNewInformationNotification(
    data: {
      activityId: number;
      informationId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    return this._createNotification(
      {
        message: `${sender.username} created a new information`,
        activityId: data.activityId,
        informationId: data.informationId,
      },
      sender,
      receiver,
    );
  }
}
