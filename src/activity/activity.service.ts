import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

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
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
