import { AbstractEntity } from 'src/common';
import { ProjectEntity } from 'src/modules/project/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Task = {
  name: string;
  description: string;
  status: TaskStatus;
};

@Entity({ name: 'project-log' })
export class ProjectLogEntity extends AbstractEntity {
  @Column({ type: 'jsonb' })
  tasks: Task[];

  @Column({ type: 'smallint' })
  hoursWorked: number;

  @Column({ type: 'timestamptz' })
  logDate: Date;

  @Column({ default: null })
  notes: string;

  @ManyToOne(() => ProjectEntity, (project: ProjectEntity) => project.logs, {
    eager: true,
  })
  @JoinColumn()
  project: ProjectEntity;
}
