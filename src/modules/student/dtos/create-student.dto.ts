import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Constants } from 'src/common';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  regNumber: string;

  @IsNumber()
  @Min(1)
  @Max(6)
  @IsNotEmpty()
  yearOfStudy: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  programmeCode: string;

  @IsString()
  @IsNotEmpty()
  university: string;

  @IsString()
  @Matches(Constants.PasswordRegEx)
  @IsNotEmpty()
  password: string;
}
