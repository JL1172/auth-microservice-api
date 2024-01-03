import { Injectable } from '@nestjs/common';
import {
  InstanceOfTokenExpType,
  JwtDecodedType,
} from 'src/user-auth/dtos/dtos';

@Injectable()
export class DecodedJwtHolder {
  private readonly jwt_house: JwtDecodedType[];
  constructor() {
    this.jwt_house = [];
  }
  store_decoded_token(token: JwtDecodedType): void {
    this.jwt_house[0] = token;
  }
  read_decoded_token(): JwtDecodedType[] {
    return this.jwt_house;
  }
}
@Injectable()
export class FinalizedPayloadProvider {
  private blacklist_token_payload: InstanceOfTokenExpType;
  constructor() {
    this.blacklist_token_payload;
  }
  store_token(token: InstanceOfTokenExpType): void {
    this.blacklist_token_payload = token;
  }
  read_token(): InstanceOfTokenExpType {
    return this.blacklist_token_payload;
  }
}
