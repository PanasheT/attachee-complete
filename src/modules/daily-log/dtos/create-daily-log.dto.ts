import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDailyLogDto {
  @IsUUID()
  @IsNotEmpty()
  readonly studentUUID: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsDate()
  @IsNotEmpty()
  readonly checkIn: Date;

  @IsDate()
  @IsNotEmpty()
  readonly checkOut: Date;

  @IsString()
  @IsOptional()
  readonly difficulties?: string;

  @IsString()
  @IsOptional()
  readonly comment?: string;
}
