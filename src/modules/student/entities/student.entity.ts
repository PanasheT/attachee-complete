import { AbstractEntity } from 'src/common';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { ProjectEntity } from 'src/modules/project/entities';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'student' })
export class StudentEntity extends AbstractEntity {
  @Column({ unique: true, update: false })
  regNumber: string;

  @Column({ type: 'smallint', default: 3 })
  yearOfStudy: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  programmeCode: string;

  @Column()
  university: string;

  @Column()
  password: string;

  @OneToMany(
    () => DailyLogEntity,
    (dailyLog: DailyLogEntity) => dailyLog.student
  )
  dailyLogs: DailyLogEntity[];

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.student)
  projects: ProjectEntity[];
}
