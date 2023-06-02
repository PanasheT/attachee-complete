import { PartialType, PickType } from '@nestjs/swagger';
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
) {}
