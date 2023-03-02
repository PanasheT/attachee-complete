import * as moment from 'moment';
import { ProjectLogEntity } from 'src/modules/project-log/entities';

export interface ProjectLogPdf {
  projectLogEntries: {
    name: string;
    description: string;
    status: string;
    hoursWorked: number;
  }[];
  logDate: string;
  regNumber: string;
  notes: string;
  name: string;
}

export function ProjectLogPdfFactory(model: ProjectLogEntity): ProjectLogPdf {
  const projectLogEntries = [];

  model.tasks.forEach((task) => {
    projectLogEntries.push({
      ...task,
      status: task.status.split('_').join(' '),
    });
  });

  return {
    projectLogEntries,
    logDate: moment(model.logDate).format('Do [of] MMMM, YYYY'),
    regNumber: model.project.student.regNumber,
    notes: model.notes,
    name: model.project.name,
  };
}
