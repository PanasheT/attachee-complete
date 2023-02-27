import { Task, TaskStatus } from '../entities';

export class TaskDto {
  name: string;
  description: string;
  status: TaskStatus;
}

export function TaskDtoFactory(task: Task): TaskDto {
  return {
    name: task.name,
    description: task.description,
    status: task.status,
  };
}
