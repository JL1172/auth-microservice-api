import { PrismaClient } from '@prisma/client';
import * as chalk from 'chalk';
import * as readlineSync from 'readline-sync';
const prisma = new PrismaClient();

async function reset_seed_data(): Promise<void> {
  try {
    const index: number = readlineSync.keyInSelect(
      ['Yes', 'No'],
      '\nThis script deletes data and resets the indexes, do you want to proceed?\n',
    );
    if (index === 1) {
      console.log('Exiting script....');
      setTimeout((): void => {
        process.exit();
      }, 500);
    }
    if (index == 0) {
      console.log(chalk.red.bold.underline('\nDeleting Data in 5 seconds\n'));
      let count: number = 5;
      const intervalId: any = setInterval(async (): Promise<void> => {
        if (count === 0) {
          clearInterval(intervalId);
          await prisma.user.deleteMany();
          await prisma.blacklistJwt.deleteMany();
          await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
          await prisma.$executeRaw`ALTER SEQUENCE "BlacklistJwt_id_seq" RESTART WITH 1;`;
          console.log(
            chalk.green('All data has been deleted, exiting process now'),
          );
        } else {
          console.log(`\n${count--} seconds\n`);
        }
      }, 1000);
    }
  } catch (err) {
    console.log(chalk.red.bold('* Error seeding data, error: ' + err));
  }
}

reset_seed_data();
