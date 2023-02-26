import { PartialType, PickType } from '@nestjs/swagger';
import { CreateGitCommitDto } from './create-git-commit.dto';

export class UpdateGitCommitDto extends PartialType(
  PickType(CreateGitCommitDto, ['commitHash', 'commitMessage'] as const)
) {}
