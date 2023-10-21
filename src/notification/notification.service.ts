import { Injectable } from '@nestjs/common';
import { sendNotification } from 'src/auth/utils/send-notification';
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
      orderBy: {
        createdAt: 'desc',
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
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'New activity',
        description: `@${sender.username} created a new activity`,
        data,
      },
    );

    return this._createNotification(
      {
        title: 'New activity',
        message: `@${sender.username} created a new activity`,
        action: 'create',
        feature: 'activity',
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
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'New post',
        description: `@${sender.username} created a new post`,
        data,
      },
    );

    return this._createNotification(
      {
        action: 'create',
        feature: 'post',
        title: 'New post',
        message: `@${sender.username} created a new post`,
        activityId: data.activityId,
        postId: data.postId,
      },
      sender,
      receiver,
    );
  }

  createLikePostNotification(
    data: {
      activityId: number;
      postId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'Like post',
        description: `@${sender.username} like your post`,
        data,
      },
    );

    return this._createNotification(
      {
        action: 'like',
        feature: 'post',
        title: 'Like post',
        message: `@${sender.username} like your post`,
        activityId: data.activityId,
        postId: data.postId,
      },
      sender,
      receiver,
    );
  }

  createCommentPostNotification(
    data: {
      activityId: number;
      postId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'Comment post',
        description: `@${sender.username} comment on your post`,
        data,
      },
    );

    return this._createNotification(
      {
        action: 'comment',
        feature: 'post',
        title: 'Comment post',
        message: `@${sender.username} comment on your post`,
        activityId: data.activityId,
        postId: data.postId,
      },
      sender,
      receiver,
    );
  }

  createNewGroupChatNotification(
    data: {
      activityId: number;
    },
    sender: RequestUser,
    receiver: RequestUser[],
  ) {
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'Group chat',
        description: `@${sender.username} send message to group chat`,
        data,
      },
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
    sendNotification(
      receiver.map((user) => user.id.toString()),
      {
        title: 'New information',
        description: `@${sender.username} created a new information`,
        data,
      },
    );

    return this._createNotification(
      {
        title: 'New information',
        action: 'create',
        feature: 'information',
        message: `@${sender.username} created a new information`,
        activityId: data.activityId,
        informationId: data.informationId,
      },
      sender,
      receiver,
    );
  }
}
