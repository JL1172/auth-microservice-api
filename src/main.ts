import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import helmet from 'helmet';
import { HttpExceptionFilter } from './global-middleware/ErrorMiddleware';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.headers['trust-proxy'] = 'true';
    next();
  });
  app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
