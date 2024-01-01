import { Injectable } from '@nestjs/common';
import { BodyType } from './auth-dto';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class TokenService {
  private readonly token = jwt;
  constructor() {
    this.token = jwt;
  }
  createToken(userData: BodyType) {
    const payload: { email: string; first_name: string; last_name: string } = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
    };
    const options: { expiresIn: string } = {
      expiresIn: '1d',
    };
    return this.token.sign(payload, process.env.JWT_SECRET, options);
  }
}
