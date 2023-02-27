import { PickType } from '@nestjs/swagger';
import { ProjectDto, ProjectDtoFactory } from 'src/modules/project/dtos';
import { ProjectLogEntity } from '../entities';
import { TaskDto, TaskDtoFactory } from './task.dto';

export class ProjectLogDto extends PickType(ProjectLogEntity, [
  'uuid',
  'hoursWorked',
  'logDate',
  'notes',
] as const) {
  tasks: TaskDto[];
  project: ProjectDto;
}

export function ProjectLogDtoFactory(model: ProjectLogEntity): ProjectLogDto {
  return {
    uuid: model.uuid,
    hoursWorked: model.hoursWorked,
    logDate: model.logDate,
    notes: model.notes,
    tasks: model.tasks.map(TaskDtoFactory),
    project: ProjectDtoFactory(model.project),
  };
}
