import * as moment from 'moment';
import { ProjectEntity, ProjectStatus } from 'src/modules/project/entities';

export interface ProjectDetailsPdf {
  name: string;
  regNumber: string;
  startDate: string;
  description: string;
  status: ProjectStatus;
  gitRepoUrl: string;
}

export function ProjectDetailsPdfFactory(
  model: ProjectEntity
): ProjectDetailsPdf {
  return {
    name: model.name,
    startDate: moment(model.startDate).format('Do [of] MMMM, YYYY'),
    regNumber: model.student.regNumber,
    description: model.description,
    status: model.status,
    gitRepoUrl: model.gitRepoUrl || null,
  };
}
