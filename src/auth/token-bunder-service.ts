import { Injectable } from '@nestjs/common';
import { BodyType } from './auth-dto';
import { TokenService } from './token-service';

@Injectable()
export class Token_Bundler {
  private readonly parcel: BodyType[] = [];
  constructor(private readonly tokenBuilder: TokenService) {
    this.parcel = [];
  }
  addUser(user: BodyType): void {
    this.parcel.push(user);
  }
  parseToken(): { token: string } {
    const res = this.tokenBuilder.createToken(this.parcel[0]);
    return { token: res };
  }
}
