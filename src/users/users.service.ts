import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async getUsers(userId: number, search: string) {
    return this.prismaService.user.findMany({
      select: { id: true, username: true, email: true },
      where: {
        id: { not: { equals: userId } },
        username: { contains: search },
      },
    });
  }

  async findByEmailOrUsername(identifier: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }

  async updatePassword(id: number, password: string) {
    return this.prismaService.user.update({
      where: { id },
      data: { password },
    });
  }
}
