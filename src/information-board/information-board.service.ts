import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInformationBoardDto } from './dto/create-post.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RequestUser } from 'src/auth/utils/user-decorator';

@Injectable()
export class InformationBoardService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  async create(
    user: RequestUser,
    createInformationBoardDto: CreateInformationBoardDto,
  ) {
    const result = await this.prisma.information.create({
      data: {
        title: createInformationBoardDto.title,
        description: createInformationBoardDto.description,
        userId: user.id,
        activityId: createInformationBoardDto.activityId,
        images: {
          createMany: {
            data: createInformationBoardDto.images,
          },
        },
      },
    });

    const activityUsers = await this.prisma.activityUsers.findMany({
      where: {
        activityId: createInformationBoardDto.activityId,
        userId: {
          not: user.id,
        },
      },
    });

    await this.notificationService.createNewInformationNotification(
      {
        activityId: createInformationBoardDto.activityId,
        informationId: result.id,
      },
      user,
      activityUsers.map((activityUser) => ({
        id: activityUser.userId,
      })),
    );

    return result;
  }

  getInformationBoardByActivityId(activityId: number) {
    return this.prisma.information.findMany({
      where: {
        activityId,
      },
      include: {
        _count: {
          select: {
            images: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  getInformationBoardById(id: number) {
    return this.prisma.information.findFirst({
      where: {
        id,
      },
      include: {
        images: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  deleteInformationBoardById(id: number) {
    return this.prisma.information.delete({ where: { id } });
  }

  async updateInformationBoardById(
    id: number,
    data: CreateInformationBoardDto,
  ) {
    await this.prisma.informationImage.deleteMany({
      where: {
        informationId: id,
      },
    });
    return this.prisma.information.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        images: {
          createMany: {
            data: data.images,
          },
        },
      },
    });
  }
}
