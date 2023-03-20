import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CreateGitCommit,
  CreateGitCommitDto,
} from 'src/modules/git-commit/dtos';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGitCommit)
  readonly gitCommits?: CreateGitCommitDto[];
}
