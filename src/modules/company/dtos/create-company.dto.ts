import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateSupervisorDto } from 'src/modules/supervisor/dtos';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly director: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  readonly telephone: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @Type(() => CreateSupervisorDto)
  @ValidateNested({ each: true })
  @IsNotEmpty()
  readonly supervisor: CreateSupervisorDto;
}
