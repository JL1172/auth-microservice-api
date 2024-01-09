import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { EmailPayload, RegisterBodyType } from './dtos/dtos';
import {
  CreateUserContainerProvider,
  PasswordHashProvider,
} from './services/providers/registration-providers';
import { Request, Response } from 'express';
import {
  JwtHolderProvider,
  UserStorageProvider,
} from './services/providers/login-providers';
import { PrismaService } from 'src/global-providers/prisma-service';
import { FinalizedPayloadProvider } from './services/providers/logout-provider';
import { EmailLogging } from './services/providers/email-provider';

@Controller('api/auth')
export class UserAuthController {
  constructor(
    private readonly third_party_create: CreateUserContainerProvider,
    private readonly passwordStorage: PasswordHashProvider,
    private readonly jwt_housing: JwtHolderProvider,
    private readonly prisma: PrismaService,
    private readonly finalized_payload: FinalizedPayloadProvider,
    private readonly user: UserStorageProvider,
    private readonly emailLogger: EmailLogging,
  ) {}
  @Post('register')
  async register(
    @Body() body: RegisterBodyType,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const requestPath = req.url;
    const payload: EmailPayload = {
      email: body.email,
      requestPath: requestPath,
      req: req,
    };
    await this.emailLogger.draftEmail(payload);
    body.password = this.passwordStorage.readPassword();
    await this.third_party_create.add_user_to_db(body);
    res.status(201).json({
      message: 'Successfully created user.',
    });
  }
  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<any> {
    const { email } = this.user.readUser();
    const requestPath = req.url;
    const payload: EmailPayload = {
      email: email,
      requestPath: requestPath,
      req: req,
    };
    await this.emailLogger.draftEmail(payload);
    res
      .status(200)
      .json({ message: 'Welcome back.', token: this.jwt_housing.readJwt() });
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<any> {
    const payload = this.finalized_payload.read_token();
    await this.prisma.insertJwt(payload);
    res.status(201).json({ message: 'Token Successfully Blacklisted.' });
  }
}
