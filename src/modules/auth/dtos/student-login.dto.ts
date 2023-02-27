import { IsNotEmpty, IsString } from 'class-validator';

export class StudentLoginDto {
  @IsString()
  @IsNotEmpty()
  regNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
