import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { DailyLogService } from 'src/modules/daily-log/services';
import { Repository } from 'typeorm';
import { CreateGitCommitDto, UpdateGitCommitDto } from '../dtos';
import { GitCommitEntity } from '../entities';
import { GitCommitFactory } from '../factories';
import {
  FindGitCommitQuery,
  GitCommitIdentificationProperties as GitCommitIdProps,
} from '../types';

@Injectable()
export class GitCommitService {
  private logger = new Logger(GitCommitService.name);
  constructor(
    @InjectRepository(GitCommitEntity)
    private readonly repo: Repository<GitCommitEntity>,
    private readonly dailyLogService: DailyLogService,
    private readonly factory: GitCommitFactory
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
    deleted = false
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
    const deleted = false;
    return await this.repo.findBy({
      dailyLog: { student: { uuid: studentUUID, deleted }, deleted },
      deleted,
    });
  }

  public async createGitCommit({
    dailyLogUUID,
    ...model
  }: CreateGitCommitDto): Promise<GitCommitEntity> {
    const dailyLog: DailyLogEntity =
      await this.dailyLogService.findOneDailyLogOrFail(dailyLogUUID);

    return await this.handleGitCommitSave(
      await this.getGitCommitFromFactory(model, dailyLog)
    );
  }

  private async getGitCommitFromFactory(
    model: Omit<CreateGitCommitDto, 'dailyLogUUID'>,
    dailyLog: DailyLogEntity
  ): Promise<GitCommitEntity> {
    try {
      return await this.factory.createGitCommit(model, dailyLog);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleGitCommitSave(
    model: GitCommitEntity
  ): Promise<GitCommitEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create git commit.');
    }
  }

  public async updateGitCommit(
    uuid: string,
    model: UpdateGitCommitDto
  ): Promise<GitCommitEntity> {
    const gitCommit: GitCommitEntity = await this.findOneGitCommitOrFail(
      uuid,
      'uuid'
    );

    return await this.handleGitCommitSave(
      await this.getUpdatedGitCommitFromFactory(model, gitCommit)
    );
  }

  private async getUpdatedGitCommitFromFactory(
    model: UpdateGitCommitDto,
    gitCommit: GitCommitEntity
  ): Promise<GitCommitEntity> {
    try {
      return await this.factory.updateGitCommit(model, gitCommit);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
