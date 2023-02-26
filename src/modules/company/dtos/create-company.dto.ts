import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly supervisor: string;

  @IsString()
  @IsNotEmpty()
  readonly director: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly telephone: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
