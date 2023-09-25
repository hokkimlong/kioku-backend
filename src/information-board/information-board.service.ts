import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateInformationBoardDto } from './dto/create-post.dto';

@Injectable()
export class InformationBoardService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, createInformationBoardDto: CreateInformationBoardDto) {
    return this.prisma.information.create({
      data: {
        title: createInformationBoardDto.title,
        description: createInformationBoardDto.description,
        userId,
        activityId: createInformationBoardDto.activityId,
        images: {
          createMany: {
            data: createInformationBoardDto.images,
          },
        },
      },
    });
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
      },
    });
  }
}
