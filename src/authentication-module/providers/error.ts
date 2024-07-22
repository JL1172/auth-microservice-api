import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationErrorHandler {
  public reportHttpError(
    message: string | Record<string, string>,
    status: HttpStatus,
  ): void {
    throw new HttpException(message, status);
  }
}
