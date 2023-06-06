import { TaskEntity } from '../entities';

type TaskStudentSupervisorCollection<
  T extends keyof Pick<TaskEntity, 'student' | 'supervisor'>
> = T;

export type TaskStudentSupervisorType = TaskStudentSupervisorCollection<
  'student' | 'supervisor'
>;
