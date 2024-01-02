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
    return await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
  }
}
