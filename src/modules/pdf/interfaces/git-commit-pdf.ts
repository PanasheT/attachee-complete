import { GitCommitEntity } from 'src/modules/git-commit/entities';

export interface GitCommitPdf {
  readonly commitHash: string;
  readonly commitMessage: string;
}

export function GitCommitPdfFactory(model: GitCommitEntity): GitCommitPdf {
  return {
    commitHash: model.commitHash,
    commitMessage: model.commitMessage,
  };
}
