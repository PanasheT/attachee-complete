import { FindQuery } from 'src/common';
import { GitCommitEntity } from '../entities';

export type GitCommitIdentificationProperties = 'uuid' | 'commitHash';

export type FindGitCommitQuery = FindQuery<
  GitCommitEntity,
  GitCommitIdentificationProperties
>;
