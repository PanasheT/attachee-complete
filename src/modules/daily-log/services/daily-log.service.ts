import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { Repository } from 'typeorm';
import { CreateDailyLogDto, UpdateDailyLogDto } from '../dtos';
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

  public async findOneDailyLog(uuid: string): Promise<DailyLogEntity> {
    return await this.repo.findOneBy({ uuid, deleted: false });
  }

  public async findOneDailyLogOrFail(uuid: string): Promise<DailyLogEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted: false });
    } catch {
      throw new NotFoundException('Daily log not found.');
    }
  }

  public async findAllDailyLogs(): Promise<DailyLogEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async createDailyLog(
    model: CreateDailyLogDto
  ): Promise<DailyLogEntity> {
    const { studentUUID, ...dto } = model;
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    if (!student?.company) {
      throw new BadRequestException(
        "Can't make daily log for unattached student."
      );
    }

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

  public async updateDailyLog(
    uuid: string,
    model: UpdateDailyLogDto
  ): Promise<DailyLogEntity> {
    const dailyLog: DailyLogEntity = await this.findOneDailyLogOrFail(uuid);
    return await this.handleDailyLogSave(
      await this.getUpdatedDailyLogFromFactory(model, dailyLog)
    );
  }

  private async getUpdatedDailyLogFromFactory(
    model: UpdateDailyLogDto,
    dailyLog: DailyLogEntity
  ): Promise<DailyLogEntity> {
    try {
      return await this.factory.updateDailyLog(model, dailyLog);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  public async addFileIdToDailyLog(
    model: DailyLogEntity
  ): Promise<DailyLogEntity> {
    if (!model?.fileId) {
      throw new BadRequestException('Missing File Id.');
    }

    return await this.handleDailyLogSave(model);
  }

  public async deleteDailyLog(uuid: string): Promise<void> {
    const dailyLog: DailyLogEntity = await this.findOneDailyLogOrFail(uuid);
    dailyLog.deleted = true;

    await this.handleDailyLogSave(dailyLog);
  }
}
