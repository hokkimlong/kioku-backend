import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ActivityService {

  constructor(private readonly prisma: PrismaService) { }

  createActivity(userId: number, createActivityDto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: { ...createActivityDto, users: { create: [{ userId, role: Role.ADMIN }] } }
    }
    )
  }

  getActivitiesByUserId(userId: number) {
    return this.prisma.activity.findMany({
      where: { users: { every: { userId } } }, include: {
        _count: {
          select: { users: true, informations: true, posts: true }
        }
      }
    })
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
