import { PickType } from '@nestjs/mapped-types';
import { DailyLogDto, DailyLogDtoFactory } from 'src/modules/daily-log/dtos';
import { GitCommitEntity } from '../entities';

export class GitCommitDto extends PickType(GitCommitEntity, [
  'commitHash',
  'commitMessage',
  'uuid',
  'createdAt',
] as const) {
  dailyLog: DailyLogDto;
}

export function GitCommitDtoFactory(model: GitCommitEntity): GitCommitDto {
  return {
    commitHash: model.commitHash,
    commitMessage: model.commitMessage,
    uuid: model.uuid,
    createdAt: model.createdAt,
    dailyLog: DailyLogDtoFactory(model.dailyLog),
  };
}
