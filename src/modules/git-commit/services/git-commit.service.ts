import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GitCommitEntity } from '../entities';
import {
  FindGitCommitQuery,
  GitCommitIdentificationProperties,
} from '../types';

@Injectable()
export class GitCommitService {
  constructor(
    @InjectRepository(GitCommitEntity)
    private readonly repo: Repository<GitCommitEntity>
  ) {}

  public async findOneGitCommit(
    value: string,
    property: GitCommitIdentificationProperties
  ): Promise<GitCommitEntity> {
    const query: FindGitCommitQuery = this.generateFindQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findOneGitCommitOrFail(
    value: string,
    property: GitCommitIdentificationProperties
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

  private generateFindQuery(
    value: string,
    property: GitCommitIdentificationProperties,
    deleted: boolean = false
  ): FindGitCommitQuery {
    return { [property]: value, deleted };
  }
}
