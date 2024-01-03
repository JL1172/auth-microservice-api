import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as chalk from 'chalk';
import { PrismaService } from 'src/global-providers/prisma-service';
import { InstanceOfTokenExpType } from 'src/auth-module/dtos/dtos';

@Injectable()
export class QueryExpiredToken {
  private readonly logger = new Logger(QueryExpiredToken.name);
  constructor(private readonly prisma: PrismaService) {
    this.logger = new Logger(QueryExpiredToken.name);
  }
  @Cron(CronExpression.EVERY_HOUR)
  async queryExpiredToken(): Promise<void> {
    try {
      const number_of_data: InstanceOfTokenExpType[] =
        await this.prisma.findAllJwt();
      const count_stat: number = number_of_data.length;
      await this.prisma.removeExpiredJwt();
      const number_of_data_post: InstanceOfTokenExpType[] =
        await this.prisma.findAllJwt();
      const count_stat_post: number = number_of_data_post.length;
      this.logger.log(
        chalk(
          `${chalk.blueBright('Background Worker')}: {${chalk.greenBright(
            'cron job executed',
          )}} {${chalk.yellowBright('stats:')} remaining: ${chalk.cyanBright(
            count_stat_post,
          )}, deleted: ${chalk.redBright(count_stat - count_stat_post)}}`,
        ),
      );
    } catch (err) {
      this.logger.error(
        chalk.red.bold(`*  Error With Background Worker: ${err}`),
      );
    }
  }
}
