import { PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(
  PickType(CreateTaskDto, [
    'description',
    'dueDate',
    'notes',
    'priority',
    'status',
    'title',
  ] as const)
) {
  @IsString()
  @IsOptional()
  readonly feedback: string;
}

export class UpdateTaskAsStudentDto extends PartialType(
  PickType(UpdateTaskDto, ['notes', 'status'] as const)
) {}
