import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  createActivity(userId: number, createActivityDto: CreateActivityDto) {
    const { startDate, endDate, image, name } = createActivityDto;
    return this.prisma.activity.create({
      data: {
        name,
        image,
        startDate,
        endDate,
        users: {
          createMany: {
            data: [
              {
                userId,
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
  }

  async getActivitiesByUserId(userId: number) {
    return this.prisma.activity.findMany({
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
            userId: userId,
          },
          select: {
            userId: true,
            role: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.activity.findFirst({
      where: {
        id: id,
      },
    });
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
          where: {
            role: {
              not: Role.ADMIN,
            },
          },
          select: {
            userId: true,
            role: true,
          },
        },
      },
    });
    console.log('currentActivityMembersList', currentActivityMembersList.users);

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
