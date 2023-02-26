import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { CreateGitCommitDto, UpdateGitCommitDto } from '../dtos';
import { GitCommitEntity } from '../entities';

@Injectable()
export class GitCommitFactory {
  constructor(
    @InjectRepository(GitCommitEntity)
    private readonly repo: Repository<GitCommitEntity>
  ) {}

  public async createGitCommit(
    model: Omit<CreateGitCommitDto, 'dailyLogUUID'>,
    dailyLog: DailyLogEntity
  ): Promise<GitCommitEntity> {
    await this.assertGitCommitExists(model.commitHash);
    return Object.assign(new GitCommitEntity(), { dailyLog, ...model });
  }

  private async assertGitCommitExists(commitHash: string): Promise<void> {
    const gitCommit: GitCommitEntity = await this.repo.findOneBy({
      commitHash,
      deleted: false,
    });

    if (gitCommit) {
      throw new NotAcceptableException('Git commit already exists.');
    }
  }

  public async updateGitCommit(
    model: UpdateGitCommitDto,
    gitCommit: GitCommitEntity
  ): Promise<GitCommitEntity> {
    const validatedDto: Partial<GitCommitEntity> = validateUpdate(
      gitCommit,
      model
    );

    if (gitCommit?.commitHash) {
      await this.assertGitCommitExists(gitCommit.commitHash);
    }

    return Object.assign(gitCommit, validatedDto);
  }
}
