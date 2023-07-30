import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { hashPassword } from './utils/hash-password';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findByEmail(email: string) {
    return this.prismaService.user.findFirst({ where: { email } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    data.password = await hashPassword(data.password);
    return this.prismaService.user.create({ data });
  }
}
