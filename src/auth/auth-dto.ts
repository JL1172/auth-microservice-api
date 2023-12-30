import { IsEmail, IsNotEmpty } from 'class-validator';

export class BodyType {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export class LoginType {
  email: string;
  password: string;
}

export class FirstNameValidation {
  @IsNotEmpty({ message: 'First name required' })
  first_name: string;
}
export class LastNameValidation {
  @IsNotEmpty({ message: 'Last name required' })
  last_name: string;
}
export class EmailValidation {
  @IsNotEmpty({ message: 'Email required' })
  @IsEmail({}, { message: 'Must be valid email' })
  email: string;
}
export class PasswordValidation {
  @IsNotEmpty({ message: 'Password required' })
  password: string;
}
