import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global-providers/prisma-service';
import { RegisterBodyType } from 'src/auth-module/dtos/dtos';

@Injectable()
export class PasswordHashProvider {
  private password = '';
  constructor() {
    this.password = '';
  }
  storePassword(pswrd: string): void {
    this.password = pswrd;
  }
  readPassword(): string {
    return this.password;
  }
}
@Injectable()
export class CreateUserContainerProvider {
  constructor(private readonly prisma: PrismaService) {}
  async add_user_to_db(user: RegisterBodyType): Promise<any> {
    return await this.prisma.create(user);
  }
}
