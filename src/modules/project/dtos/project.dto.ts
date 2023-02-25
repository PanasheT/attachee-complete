import { PickType } from '@nestjs/swagger';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { ProjectEntity } from '../entities';

export class ProjectDto extends PickType(ProjectEntity, [
  'description',
  'endDate',
  'estimatedEndDate',
  'gitRepoUrl',
  'name',
  'startDate',
  'status',
  'uuid',
] as const) {
  student: StudentDto;
}

export function ProjectDtoFactory(model: ProjectEntity): ProjectDto {
  return {
    description: model.description,
    endDate: model.endDate,
    estimatedEndDate: model.estimatedEndDate,
    gitRepoUrl: model.gitRepoUrl,
    name: model.name,
    startDate: model.startDate,
    status: model.status,
    uuid: model.uuid,
    student: StudentDtoFactory(model.student),
  };
}
