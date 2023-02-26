import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export type ProjectUpdatePropertiesCollection<
  T extends keyof UpdateProjectDto
> = T;

export type ProjectUpdateProperties = ProjectUpdatePropertiesCollection<
  | 'description'
  | 'endDate'
  | 'estimatedEndDate'
  | 'gitRepoUrl'
  | 'name'
  | 'startDate'
  | 'status'
>;

export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['studentUUID' as const])
) {}
