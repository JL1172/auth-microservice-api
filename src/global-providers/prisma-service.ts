import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterBodyType } from 'src/user-auth/dtos/dtos';

@Injectable()
export class PrismaService {
  private readonly prisma = new PrismaClient();
  constructor() {
    this.prisma = new PrismaClient();
  }
  async find(user: RegisterBodyType): Promise<any> {
    const emailResult: RegisterBodyType = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const nameResult: RegisterBodyType = await this.prisma.user.findFirst({
      where: { first_name: user.first_name },
    });
    return [emailResult, nameResult];
  }
  async create(user: RegisterBodyType): Promise<any> {
    await this.prisma.user.create({ data: user });
    return await this.prisma.user.findUnique({ where: { email: user.email } });
  }
}
