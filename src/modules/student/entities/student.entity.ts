import { AbstractEntity } from 'src/common';
import { CompanyEntity } from 'src/modules/company/entities';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { ProjectEntity } from 'src/modules/project/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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

  @Column({ default: null })
  refreshToken: string;

  @OneToMany(
    () => DailyLogEntity,
    (dailyLog: DailyLogEntity) => dailyLog.student
  )
  dailyLogs: DailyLogEntity[];

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.student)
  projects: ProjectEntity[];

  @ManyToOne(
    () => CompanyEntity,
    (company: CompanyEntity) => company.students,
    { eager: true }
  )
  @JoinColumn()
  company: CompanyEntity;
}
