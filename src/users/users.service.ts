import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.prismaService.user.findFirst({ where: { username } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  async getUsers(userId: number, search: string) {
    return this.prismaService.user.findMany({
      select: { id: true, username: true, email: true },
      where: {
        id: { not: { equals: userId } },
        username: { contains: search.toLowerCase(), mode: 'insensitive' },
      },
    });
  }

  async getUserById(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        _count: {
          select: {
            activities: true,
            informations: true,
            posts: true,
          },
        },
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

  async updateUsername(id: number, username: string) {
    return this.prismaService.user.update({
      where: { id },
      data: { username },
    });
  }

  async updateProfile(id: number, data: UpdateUserDto) {
    console.log(id);
    console.log({
      email: data.email,
      id: { not: { equals: id } },
    });
    const foundUserEmail = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
        id: { not: { equals: id } },
      },
    });

    console.log(foundUserEmail);

    if (foundUserEmail)
      throw new NotFoundException({ message: 'email already exist' });

    const foundUserUsername = await this.prismaService.user.findFirst({
      where: {
        username: data.username,
        id: { not: { equals: id } },
      },
    });

    if (foundUserUsername)
      throw new NotFoundException({ message: 'username already exist' });

    return this.prismaService.user.update({ where: { id }, data });
  }

  async deleteUser(id: number) {
    console.log('delete', id);
    return this.prismaService.user.delete({ where: { id } });
  }
}
