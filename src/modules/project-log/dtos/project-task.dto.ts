import { ProjectTask, TaskStatus } from '../entities';

export class ProjectTaskDto {
  name: string;
  description: string;
  status: TaskStatus;
}

export function ProjectTaskDtoFactory(task: ProjectTask): ProjectTaskDto {
  return {
    name: task.name,
    description: task.description,
    status: task.status,
  };
}
