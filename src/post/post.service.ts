import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  getPostsByActivityId(activityId: number) {
    return this.prisma.post.findMany({
      where: {
        activityId,
      },
      include: {
        _count: {
          select: {
            postComments: true,
            postImages: true,
            postLikes: true,
          },
        },
        postImages: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createPost(userId: number, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        activityId: createPostDto.activityId,
        description: createPostDto.description,
        postImages: {
          createMany: {
            data: createPostDto.images,
          },
        },
      },
    });
  }

  createPostLike() {}
}
