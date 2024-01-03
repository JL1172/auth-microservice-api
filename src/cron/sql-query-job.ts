import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/global-providers/prisma-service';

@Injectable()
export class QueryExpiredToken {
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_HOUR)
  async queryExpiredToken(): Promise<void> {
    const result = await this.prisma.removeExpiredJwt();
    console.log(result);
  }
}
