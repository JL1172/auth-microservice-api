import { Injectable } from '@nestjs/common';
import {
  JwtTokenType,
  UserPayloadTypeJwtReference,
} from 'src/user-auth/dtos/dtos';
import jwt from 'jsonwebtoken';

@Injectable()
export class UserStorageProvider {
  private readonly user: UserPayloadTypeJwtReference[] = [];
  constructor() {
    this.user = [];
  }
  storeUser(user_to_store: UserPayloadTypeJwtReference): void {
    this.user.push(user_to_store);
  }
  readUser(): UserPayloadTypeJwtReference {
    return this.user[0];
  }
}

@Injectable()
export class JwtBuilderProvider {
  private readonly jwt: typeof jwt = jwt;
  constructor() {
    this.jwt = jwt;
  }
  createJwt(user_payload: UserPayloadTypeJwtReference) {
    const payload: { subject: number; email: string; full_name: string[] } = {
      subject: user_payload.id,
      email: user_payload.email,
      full_name: [user_payload.first_name, user_payload.last_name],
    };
    const options: { expiresIn: string } = {
      expiresIn: '1d',
    };
    return this.jwt.sign(payload, process.env.JWT_SECRET, options);
  }
}

@Injectable()
export class JwtHolderProvider {
  private jwt_housing: JwtTokenType[];
  constructor() {
    this.jwt_housing = [];
  }
  storeJwt(jwt: JwtTokenType): void {
    this.jwt_housing.push(jwt);
  }
  readJwt(): typeof this.jwt_housing {
    return this.jwt_housing;
  }
}
