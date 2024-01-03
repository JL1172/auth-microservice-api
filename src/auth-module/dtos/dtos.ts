import {
  IsAlpha,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MinLength,
  ValidationOptions,
} from 'class-validator';

export class RegisterBodyType {
  @IsNotEmpty({ message: 'First Name Required' })
  @MinLength(2, { message: 'First Name Must Be Longer Than 2 Characters' })
  @IsString({ message: 'Incorrect Format on First Name' })
  @IsAlpha(undefined, {
    message: 'First Name Must Only Be Letters',
  } as ValidationOptions)
  first_name: string;
  @IsNotEmpty({ message: 'Last Name Required' })
  @MinLength(2, { message: 'Last Name Must Be Longer Than 2 Characters' })
  @IsString({ message: 'Incorrect Format on Last Name' })
  @IsAlpha(undefined, {
    message: 'Last Name Must Only Be Letters',
  } as ValidationOptions)
  last_name: string;
  @IsNotEmpty({ message: 'Password Required' })
  @MinLength(8, { message: 'Password Must Be Longer Than 8 Characters' })
  @IsStrongPassword({}, {
    message:
      'Password Requires: Uppercase Letter, Lowercase Letter, Special Character, Number',
  } as ValidationOptions)
  @IsString({ message: 'Incorrect Format on Password' })
  password: string;
  @IsString({ message: 'Incorrect Format on Email' })
  @IsEmail({}, { message: 'Invalid Email' })
  email: string;
  @IsNotEmpty({ message: 'Username Required' })
  @IsString({ message: 'Incorrect Format on Username' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+/, {
    message: 'Must Contain Number and Letters',
  })
  username: string;
}
export class LoginBodyType {
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+/, {
    message: 'Must Contain Number and Letters',
  })
  @IsString({ message: 'Invalid format on Username' })
  @IsNotEmpty({ message: 'Username Required' })
  username: string;
  @IsString({ message: 'Invalid Format on Password' })
  @IsNotEmpty({ message: 'Password Required' })
  password: string;
}

export type UserPayloadTypeJwtReference = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
};

export class JwtTokenType {
  @IsString({ message: 'Invalid Format on Token: Expected A String Format' })
  @IsNotEmpty({ message: 'Token Required' })
  token: string;
}

export class InstanceOfTokenExpType {
  @IsString({ message: 'Invalid Format on Token: Expected A String Format' })
  @IsNotEmpty({ message: 'Token Required' })
  token: string;
  @IsDateString(
    {},
    { message: 'Invalid Format on Date: Expected A Date Format' },
  )
  expiration_time: Date;
}

export class JwtDecodedType {
  subject: number;
  email: string;
  full_name: string[];
  iat: number;
  exp: number;
}
