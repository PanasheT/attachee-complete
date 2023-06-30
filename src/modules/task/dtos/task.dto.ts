import { PickType } from '@nestjs/swagger';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import {
  SupervisorDto,
  SupervisorDtoFactory,
} from 'src/modules/supervisor/dtos';
import { TaskEntity } from '../entities';

export class TaskDto extends PickType(TaskEntity, [
  'description',
  'createdAt',
  'dueDate',
  'notes',
  'priority',
  'status',
  'title',
  'uuid',
  'feedback',
] as const) {
  student: StudentDto;
  supervisor: SupervisorDto;
}

export function TaskDtoFactory(model: TaskEntity): TaskDto {
  return {
    description: model.description,
    createdAt: model.createdAt,
    dueDate: model.dueDate,
    notes: model.notes,
    priority: model.priority,
    status: model.status,
    title: model.title,
    feedback: model?.feedback,
    uuid: model.uuid,
    student: StudentDtoFactory(model.student),
    supervisor: SupervisorDtoFactory(model.supervisor),
  };
}
