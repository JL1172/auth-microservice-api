import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BodyType } from '../auth/auth-dto';

@Injectable()
export class PrismaService {
  private readonly prisma = new PrismaClient();
  constructor() {
    this.prisma = new PrismaClient();
  }
  async search(user: BodyType): Promise<any> {
    const { email } = user;
    const result = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    const first = await this.prisma.user.findFirst({
      where: {
        first_name: user.first_name,
      },
    });
    const last = await this.prisma.user.findFirst({
      where: {
        last_name: user.last_name,
      },
    });
    return [result, first, last];
  }
  async add_user(user: BodyType): Promise<any> {
    await this.prisma.user.create({ data: user });
    return await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
  }
}
