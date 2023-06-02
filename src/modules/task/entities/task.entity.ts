import { AbstractEntity } from 'src/common';
import { TaskStatus } from 'src/modules/project-log/entities';
import { StudentEntity } from 'src/modules/student/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SupervisorEntity } from './../../supervisor/entities/supervisor.entity';

export enum PriorityEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity({ name: 'task' })
export class TaskEntity extends AbstractEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: TaskStatus })
  status: TaskStatus;

  @Column()
  dueDate: Date;

  @Column({ enum: PriorityEnum })
  priority: PriorityEnum;

  @Column({ default: null })
  notes: string;

  @ManyToOne(() => StudentEntity, { eager: true })
  @JoinColumn()
  student: StudentEntity;

  @ManyToOne(() => SupervisorEntity, { eager: true })
  @JoinColumn()
  supervisor: SupervisorEntity;
}
