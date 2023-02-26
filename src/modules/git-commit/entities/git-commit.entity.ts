import { AbstractEntity } from 'src/common';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'git-commit' })
export class GitCommitEntity extends AbstractEntity {
  @Column({ unique: true })
  commitHash: string;

  @Column()
  commitMessage: string;

  @ManyToOne(
    () => DailyLogEntity,
    (dailyLog: DailyLogEntity) => dailyLog.gitCommits,
    { nullable: true }
  )
  @JoinColumn()
  dailyLog: DailyLogEntity;
}
