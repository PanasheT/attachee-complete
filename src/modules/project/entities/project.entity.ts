import { AbstractEntity } from 'src/common';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { StudentEntity } from 'src/modules/student/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum ProjectStatus {
  COMPLETED = 'COMPLETED',
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
}

@Entity({ name: 'project' })
export class ProjectEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ enum: ProjectStatus })
  status: ProjectStatus;

  @Column('timestamptz', { default: null })
  startDate: Date;

  @Column('timestamptz', { default: null })
  endDate: Date;

  @Column('timestamptz', { default: null })
  estimatedEndDate: Date;

  @Column({ default: null })
  gitRepoUrl: string;

  @ManyToOne(
    () => StudentEntity,
    (student: StudentEntity) => student.projects,
    { eager: true }
  )
  @JoinColumn()
  student: StudentEntity;

  @OneToMany(() => ProjectLogEntity, (log: ProjectLogEntity) => log.project)
  logs: ProjectLogEntity[];
}
