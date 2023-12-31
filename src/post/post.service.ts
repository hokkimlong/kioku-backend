import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatePostCommentDto } from './dto/create-post-comment.dto';
import { NotificationService } from 'src/notification/notification.service';
import { RequestUser } from 'src/auth/utils/user-decorator';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getPostsByActivityId(userId: number, activityId: number) {
    const result = await this.prisma.post.findMany({
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
        postLikes: {
          where: {
            userId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return result.map(({ postLikes, ...post }) => ({
      ...post,
      isLike: postLikes.length > 0,
    }));
  }

  async updatePost(postId: number, createPostDto: CreatePostDto) {
    await this.prisma.postImage.deleteMany({
      where: {
        postId,
      },
    });

    return this.prisma.post.update({
      data: {
        description: createPostDto.description,
        postImages: {
          createMany: {
            data: createPostDto.images,
          },
        },
      },
      where: {
        id: postId,
      },
    });
  }

  async createPost(user: RequestUser, createPostDto: CreatePostDto) {
    const result = await this.prisma.post.create({
      data: {
        userId: user.id,
        activityId: createPostDto.activityId,
        description: createPostDto.description,
        postImages: {
          createMany: {
            data: createPostDto.images,
          },
        },
      },
    });

    const activityUsers = await this.prisma.activityUsers.findMany({
      where: {
        activityId: createPostDto.activityId,
        userId: {
          not: user.id,
        },
      },
    });

    await this.notificationService.createNewPostNotification(
      {
        activityId: createPostDto.activityId,
        postId: result.id,
      },
      user,
      activityUsers.map(({ userId }) => ({ id: userId })),
    );

    return result;
  }

  async likePost(userId: number, postId: number) {
    const userLikePost = await this.prisma.postLike.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (userLikePost) {
      return this.prisma.postLike.delete({
        where: { id: userLikePost.id },
      });
    } else {
      return this.prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });
    }
  }

  async getComments(postId: number) {
    return this.prisma.postComment.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });
  }

  async createComment(
    userId: number,
    createPostCommentDto: CreatePostCommentDto,
  ) {
    return this.prisma.postComment.create({
      data: {
        ...createPostCommentDto,
        userId,
      },
    });
  }

  async deleteComment(commentId: number) {
    return this.prisma.postComment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async deletePost(postId: number) {
    return this.prisma.post.delete({ where: { id: postId } });
  }

  async getPost(postId: number) {
    const result = await this.prisma.post.findFirst({
      where: { id: postId },
      include: {
        postImages: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return result;
  }
}
