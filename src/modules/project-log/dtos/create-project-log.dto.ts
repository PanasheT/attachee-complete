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
import { CreateProjectTaskDto } from './create-project-task.dto';

export class CreateProjectLogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProjectTaskDto)
  tasks: CreateProjectTaskDto[];

  @IsDate()
  @IsNotEmpty()
  logDate: Date;

  @IsString()
  @IsOptional()
  notes: string;

  @IsUUID()
  @IsNotEmpty()
  projectUUID: string;
}
