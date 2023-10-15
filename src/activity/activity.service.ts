import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { RequestUser } from 'src/auth/utils/user-decorator';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createActivity(
    user: RequestUser,
    createActivityDto: CreateActivityDto,
  ) {
    const { startDate, endDate, image, name } = createActivityDto;

    const result = await this.prisma.activity.create({
      data: {
        name,
        image,
        startDate,
        endDate,
        users: {
          createMany: {
            data: [
              {
                userId: user.id,
                role: Role.ADMIN,
              },
              ...createActivityDto.members.map((member) => ({
                userId: member.id,
                role: Role.USER,
              })),
            ],
          },
        },
      },
    });

    await this.notificationService.createNewActivityNotification(
      {
        activityId: result.id,
      },
      user,
      createActivityDto.members.map((member) => ({
        id: member.id,
      })),
    );

    return result;
  }

  async getActivitiesByUserId(userId: number) {
    const result = await this.prisma.activity.findMany({
      where: {
        users: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        _count: {
          select: { users: true, informations: true, posts: true },
        },
        users: {
          where: {
            role: Role.ADMIN,
            userId,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return result.map(({ users, ...activity }) => ({
      ...activity,
      isAdmin: users.length > 0,
    }));
  }

  async findOne(id: number) {
    const result = await this.prisma.activity.findFirst({
      where: {
        id: id,
      },
      include: {
        users: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    return {
      ...result,
      users: result.users.map((user: any) => {
        return user.user;
      }),
    };
  }

  async update(id: number, createActivityDto: UpdateActivityDto) {
    const { startDate, endDate, image, name } = createActivityDto;
    // query for all current Member List without the admin role
    const currentActivityMembersList = await this.prisma.activity.findUnique({
      where: {
        id: id,
      },
      include: {
        users: {
          // where: {
          //   role: {
          //     not: Role.ADMIN,
          //   },
          // },
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });
    console.log('currentActivityMembersList', currentActivityMembersList.users);
    // remove admin from createActivityDto.members
    const findAdminToExclude = () => {
      createActivityDto.members = createActivityDto.members.filter((member) => {
        const index = currentActivityMembersList.users.findIndex(
          (user) => user.userId === member.id && user.role === Role.ADMIN,
        );
        if (index !== -1) {
          console.log('found admin', member);
          currentActivityMembersList.users.splice(index, 1);
          return false;
        }
        return true;
      });
    };
    findAdminToExclude();
    console.log('createActivityDto.members', createActivityDto.members);

    // get userIds to delete
    const userIdsToRemove = currentActivityMembersList.users
      .filter(
        (user) =>
          !createActivityDto.members
            .map((member) => member.id)
            .includes(user.userId),
      )
      .map((user) => user.userId);
    console.log('userIdsToRemove', userIdsToRemove);

    // get userIds to add
    const userIdsToAdd = createActivityDto.members
      .map((member) => member.id)
      .filter(
        (id) =>
          !currentActivityMembersList.users
            .map((user) => user.userId)
            .includes(id),
      );
    console.log('userIdsToAdd', userIdsToAdd);

    return this.prisma.activity.update({
      where: { id: id },
      data: {
        name,
        image,
        startDate,
        endDate,
        users: {
          deleteMany: {
            userId: {
              in: userIdsToRemove,
            },
          },
          createMany: {
            data: userIdsToAdd.map((userId) => ({
              userId,
              role: Role.USER,
            })),
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.activity.delete({
      where: { id: Number(id) },
    });
  }
}
