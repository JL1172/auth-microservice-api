import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsStrongPassword,
  Matches,
  Min,
} from 'class-validator';

export class RegisterBody {
  @IsEmail({}, { message: 'Must Be A Valid Email.' })
  @IsNotEmpty({ message: 'Email Required.' })
  email: string;
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 2,
      minNumbers: 2,
      minSymbols: 2,
      minUppercase: 2,
    },
    {
      message:
        'Must Be A Strong Password Containing The Following: Min length of 8, at least two lower case letters, numbers, symbols, and uppercase letters.',
    },
  )
  @IsNotEmpty({ message: 'Passsword Required.' })
  password: string;
  @IsString({ message: 'Must Be A String.' })
  @IsNotEmpty({ message: 'Company Name Required.' })
  company_name: string;
  @IsNumberString({}, { message: 'Must Be A Number.' })
  @IsNotEmpty({ message: 'Age Required.' })
  @Min(18, { message: 'Minimum Age Is 18' })
  age: string;
  @IsString({ message: 'Username Must Be String.' })
  @IsNotEmpty({ message: 'Username Is Required.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d).+/, {
    message: 'Username Must Consist Of Numbers And Letters.',
  })
  username: string;
  @IsString({ message: 'First Name Must Be A String.' })
  @IsNotEmpty({ message: 'First Name Is Required.' })
  first_name: string;
  @IsString({ message: 'Last Name Must Be A String.' })
  @IsNotEmpty({ message: 'Last Name Is Required.' })
  last_name: string;
}
