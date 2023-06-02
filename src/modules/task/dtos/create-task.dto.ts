import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskStatus } from 'src/modules/project-log/entities';
import { PriorityEnum } from '../entities';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  readonly status: TaskStatus;

  @IsDate()
  @IsNotEmpty()
  readonly dueDate: Date;

  @IsEnum(PriorityEnum)
  @IsNotEmpty()
  readonly priority: PriorityEnum;

  @IsString()
  @IsOptional()
  readonly notes: string;

  @IsUUID()
  @IsNotEmpty()
  readonly studentUUID: string;

  @IsUUID()
  @IsNotEmpty()
  readonly supervisorUUID: string;
}
