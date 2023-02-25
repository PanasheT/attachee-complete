import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ProjectStatus } from '../entities';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEnum(ProjectStatus)
  @IsNotEmpty()
  readonly status: ProjectStatus;

  @IsDate()
  @IsOptional()
  readonly startDate: Date;

  @IsDate()
  @IsOptional()
  readonly endDate: Date;

  @IsDate()
  @IsOptional()
  readonly estimatedEndDate: Date;

  @IsUrl()
  @IsOptional()
  readonly gitRepoUrl: string;
}
