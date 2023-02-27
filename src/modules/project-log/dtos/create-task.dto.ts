import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../entities';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status: TaskStatus;
}
