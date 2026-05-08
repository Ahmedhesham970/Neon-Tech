/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../utils/role.enum';
export class CreateUserDto {
  //NAME
  @IsString()
  @MinLength(6, { message: 'name must be at least 6 characters long' })
  name: string | undefined;

  //EMAIL
  @IsEmail(
    { allow_underscores: true },
    { message: 'Email must be a valid email address' },
  )
  email: string | undefined;

  //PASSWORD
  @IsString()
  @IsNotEmpty()
  // @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 symbol',
    },
  )
  password: string | undefined;
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
