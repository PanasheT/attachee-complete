import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class CreateProjectLogDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];

  @IsNumber()
  @IsNotEmpty()
  hoursWorked: number;

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
