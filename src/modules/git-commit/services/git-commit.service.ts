import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { DailyLogService } from 'src/modules/daily-log/services';
import { Repository } from 'typeorm';
import { CreateGitCommitDto } from '../dtos';
import { GitCommitEntity } from '../entities';
import {
  FindGitCommitQuery,
  GitCommitIdentificationProperties as GitCommitIdProps,
} from '../types';

@Injectable()
export class GitCommitService {
  constructor(
    @InjectRepository(GitCommitEntity)
    private readonly repo: Repository<GitCommitEntity>,
    private readonly dailyLogService: DailyLogService
  ) {}

  public async findOneGitCommit(
    value: string,
    property: GitCommitIdProps
  ): Promise<GitCommitEntity> {
    const query: FindGitCommitQuery = this.generateFindQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  private generateFindQuery(
    value: string,
    property: GitCommitIdProps,
    deleted: boolean = false
  ): FindGitCommitQuery {
    return { [property]: value, deleted };
  }

  public async findOneGitCommitOrFail(
    value: string,
    property: GitCommitIdProps
  ): Promise<GitCommitEntity> {
    try {
      const query: FindGitCommitQuery = this.generateFindQuery(value, property);
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('Git commit not found.');
    }
  }

  public async findAllGitCommits(): Promise<GitCommitEntity[]> {
    return (await this.repo.findBy({ deleted: false })) || [];
  }

  public async findGitCommitsByDailyLogUUID(
    dailyLogUUID: string
  ): Promise<GitCommitEntity[]> {
    return await this.repo.findBy({
      dailyLog: { uuid: dailyLogUUID, deleted: false },
      deleted: false,
    });
  }

  public async findGitCommitsByStudentUUID(
    studentUUID: string
  ): Promise<GitCommitEntity[]> {
    const deleted: boolean = false;
    return await this.repo.findBy({
      dailyLog: { student: { uuid: studentUUID, deleted }, deleted },
      deleted,
    });
  }

  public async createDailyLog({
    dailyLogUUID,
    ...model
  }: CreateGitCommitDto): Promise<GitCommitEntity> {
    const dailyLog: DailyLogEntity =
      await this.dailyLogService.findOneDailyLogOrFail(dailyLogUUID);

    return;
  }
}
