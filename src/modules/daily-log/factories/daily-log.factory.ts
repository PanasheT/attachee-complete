import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GitCommitEntity } from 'src/modules/git-commit/entities';
import { GitCommitFactory } from 'src/modules/git-commit/factories';
import { StudentEntity } from 'src/modules/student/entities';
import {
  areDatesTheSame,
  getStartAndEndOfDate,
  validateUpdate,
} from 'src/util';
import { Between, Repository } from 'typeorm';
import { CreateDailyLogDto, UpdateDailyLogDto } from '../dtos';
import { DailyLogEntity } from '../entities';

@Injectable()
export class DailyLogFactory {
  constructor(
    @InjectRepository(DailyLogEntity)
    private readonly repo: Repository<DailyLogEntity>,
    private readonly gitCommitFactory: GitCommitFactory
  ) {}

  public async createDailyLog(
    model: Omit<CreateDailyLogDto, 'studentUUID'>,
    student: StudentEntity
  ): Promise<DailyLogEntity> {
    this.assertDatesAreValid(model.checkIn, model.checkOut);
    await this.assertDailyLogDailyLimit(model.checkIn, student.uuid);

    const gitCommits: GitCommitEntity[] = await this.createGitCommits(
      model.gitCommits
    );

    return Object.assign(new DailyLogEntity(), {
      student,
      gitCommits,
      ...model,
    });
  }

  private assertDatesAreValid(checkIn: Date, checkOut: Date): void {
    if (!areDatesTheSame(checkIn, checkOut)) {
      throw new NotAcceptableException(
        'Check in and check out must be the same date.'
      );
    }

    if (checkIn >= checkOut) {
      throw new NotAcceptableException('Check out comes after check in.');
    }

    if (new Date() < checkOut && !areDatesTheSame(new Date(), checkOut)) {
      throw new NotAcceptableException('Future daily logs are unacceptable.');
    }
  }

  private async assertDailyLogDailyLimit(
    checkIn: Date,
    studentUUID: string
  ): Promise<void> {
    const { startOfLogDate, endOfLogDate } = getStartAndEndOfDate(checkIn);

    const existingDailyLogs = await this.repo.findBy({
      checkIn: Between(startOfLogDate, endOfLogDate),
      student: { uuid: studentUUID },
    });

    if (existingDailyLogs.length >= 5) {
      throw new NotAcceptableException(
        'Maximum of Five (5) Daily Logs per day.'
      );
    }
  }

  private async createGitCommits(
    gitCommits: CreateDailyLogDto['gitCommits']
  ): Promise<GitCommitEntity[]> {
    if (!gitCommits || gitCommits.length === 0) return null;

    return await Promise.all(
      gitCommits.map(async (gitCommit) =>
        this.gitCommitFactory.createGitCommit(gitCommit, null)
      )
    );
  }

  public async updateDailyLog(
    model: UpdateDailyLogDto,
    dailyLog: DailyLogEntity
  ): Promise<DailyLogEntity> {
    const validatedDto: Partial<DailyLogEntity> = validateUpdate(
      dailyLog,
      model
    );

    const { checkIn, checkOut } = validatedDto;

    if (checkIn && checkOut) {
      this.assertDatesAreValid(checkIn, checkOut);
    } else if (checkIn && !checkOut) {
      this.assertDatesAreValid(checkIn, dailyLog.checkOut);
    } else if (checkOut && !checkIn) {
      this.assertDatesAreValid(dailyLog.checkIn, checkOut);
    }

    return {...dailyLog, ...validatedDto};
  }
}
