import { AbstractEntity } from 'src/common';
import { StudentEntity } from 'src/modules/student/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'daily-log' })
export class DailyLogEntity extends AbstractEntity {
  @Column()
  description: string;

  @Column('timestamptz')
  checkIn: Date;

  @Column('timestamptz')
  checkOut: Date;

  @Column({ default: null })
  difficulties?: string;

  @Column({ default: null })
  comment?: string;

  @ManyToOne(
    () => StudentEntity,
    (student: StudentEntity) => student.dailyLogs,
    { eager: true }
  )
  @JoinColumn()
  student: StudentEntity;
}
