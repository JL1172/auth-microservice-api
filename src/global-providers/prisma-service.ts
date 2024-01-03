import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  InstanceOfTokenExpType,
  JwtTokenType,
  LoginBodyType,
  RegisterBodyType,
  UserPayloadTypeJwtReference,
} from 'src/user-auth/dtos/dtos';

@Injectable()
export class PrismaService {
  private readonly prisma = new PrismaClient();
  constructor() {
    this.prisma = new PrismaClient();
  }
  async find(user: RegisterBodyType): Promise<any> {
    //!might be a problem
    const emailResult: UserPayloadTypeJwtReference =
      await this.prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
    const nameResult: UserPayloadTypeJwtReference =
      await this.prisma.user.findFirst({
        where: { first_name: user.first_name },
      });
    const usernameResult: UserPayloadTypeJwtReference =
      await this.prisma.user.findUnique({ where: { username: user.username } });
    return [emailResult, nameResult, usernameResult];
  }
  async create(user: RegisterBodyType): Promise<any> {
    await this.prisma.user.create({ data: user });
    return await this.prisma.user.findUnique({ where: { email: user.email } });
  }
  async findForLogin(
    user: LoginBodyType,
  ): Promise<UserPayloadTypeJwtReference> {
    return await this.prisma.user.findUnique({
      where: { username: user.username },
    });
  }
  async findJwt(jwt: JwtTokenType): Promise<InstanceOfTokenExpType> {
    return await this.prisma.blacklistJwt.findUnique({
      where: { token: jwt.token },
    });
  }
  async insertJwt(jwt: InstanceOfTokenExpType): Promise<void> {
    await this.prisma.blacklistJwt.create({ data: jwt });
  }
}
