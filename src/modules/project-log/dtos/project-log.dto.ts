import { PickType } from '@nestjs/swagger';
import { ProjectDto, ProjectDtoFactory } from 'src/modules/project/dtos';
import { ProjectLogEntity } from '../entities';
import { ProjectTaskDto, ProjectTaskDtoFactory } from './project-task.dto';

export class ProjectLogDto extends PickType(ProjectLogEntity, [
  'uuid',
  'hoursWorked',
  'logDate',
  'notes',
] as const) {
  tasks: ProjectTaskDto[];
  project: ProjectDto;
}

export function ProjectLogDtoFactory(model: ProjectLogEntity): ProjectLogDto {
  return {
    uuid: model.uuid,
    hoursWorked: model.hoursWorked,
    logDate: model.logDate,
    notes: model.notes,
    tasks: model.tasks.map(ProjectTaskDtoFactory),
    project: ProjectDtoFactory(model.project),
  };
}
