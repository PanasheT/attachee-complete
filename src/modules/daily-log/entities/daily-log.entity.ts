import { AbstractEntity } from 'src/common';
import { GitCommitEntity } from 'src/modules/git-commit/entities';
import { StudentEntity } from 'src/modules/student/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'daily-log' })
export class DailyLogEntity extends AbstractEntity {
  @Column()
  description: string;

  @Column('timestamptz')
  checkIn: Date;

  @Column('timestamptz')
  checkOut: Date;

  @Column({ default: null })
  difficulties: string;

  @Column({ default: null })
  comment: string;

  @Column({ default: null })
  fileId: string;

  @Column({ default: false })
  isVerified: boolean;

  @ManyToOne(
    () => StudentEntity,
    (student: StudentEntity) => student.dailyLogs,
    { eager: true }
  )
  @JoinColumn()
  student: StudentEntity;

  @OneToMany(
    () => GitCommitEntity,
    (gitCommit: GitCommitEntity) => gitCommit.dailyLog,
    { cascade: true }
  )
  gitCommits: GitCommitEntity[];
}
