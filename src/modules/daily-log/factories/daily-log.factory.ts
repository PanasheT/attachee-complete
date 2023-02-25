import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { areDatesTheSame, getStartAndEndOfDate } from 'src/util';
import { Between, Repository } from 'typeorm';
import { CreateDailyLogDto } from '../dtos';
import { DailyLogEntity } from '../entities';

@Injectable()
export class DailyLogFactory {
  constructor(
    @InjectRepository(DailyLogEntity)
    private readonly repo: Repository<DailyLogEntity>
  ) {}

  public async createDailyLog(
    model: Omit<CreateDailyLogDto, 'studentUUID'>,
    student: StudentEntity
  ): Promise<DailyLogEntity> {
    this.assertDatesAreValid(model.checkIn, model.checkOut);
    await this.assertDailyLogDailyLimit(model.checkIn, student.uuid);

    return Object.assign(new DailyLogEntity(), { student, ...model });
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

    if (new Date() < checkOut) {
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
}
