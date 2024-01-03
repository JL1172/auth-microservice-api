import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as chalk from 'chalk';
import { PrismaService } from 'src/global-providers/prisma-service';

@Injectable()
export class QueryExpiredToken {
  private readonly logger = new Logger(QueryExpiredToken.name);
  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(QueryExpiredToken.name);
  }
  @Cron(CronExpression.EVERY_HOUR)
  async queryExpiredToken(): Promise<void> {
    try {
      await this.prisma.removeExpiredJwt();
      this.logger.log(
        chalk.white.bold(
          '*  Background Worker: {sql-script executed: (cron job executed)}  *',
        ),
      );
    } catch (err) {
      this.logger.error(
        chalk.red.bold(`*  Error With Background Worker: ${err}`),
      );
    }
  }
}
