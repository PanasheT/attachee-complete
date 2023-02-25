import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { Repository } from 'typeorm';
import { CreateDailyLogDto } from '../dtos';
import { DailyLogEntity } from '../entities';
import { DailyLogFactory } from '../factories';

@Injectable()
export class DailyLogService {
  constructor(
    @InjectRepository(DailyLogEntity)
    private readonly repo: Repository<DailyLogEntity>,
    private readonly studentService: StudentService,
    private readonly factory: DailyLogFactory
  ) {}

  public async createDailyLog(
    model: CreateDailyLogDto
  ): Promise<DailyLogEntity> {
    const { studentUUID, ...dto } = model;
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    return await this.handleDailyLogSave(
      await this.getDailyLogFromFactory(dto, student)
    );
  }

  private async getDailyLogFromFactory(
    model: Omit<CreateDailyLogDto, 'studentUUID'>,
    student: StudentEntity
  ): Promise<DailyLogEntity> {
    try {
      return await this.factory.createDailyLog(model, student);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleDailyLogSave(
    model: DailyLogEntity
  ): Promise<DailyLogEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create Daily Log.');
    }
  }
}
