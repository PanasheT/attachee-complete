import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/modules/project/entities';
import { ProjectService } from 'src/modules/project/services';
import { getStartAndEndOfDate } from 'src/util';
import { Between, IsNull, Repository } from 'typeorm';
import { CreateProjectLogDto } from '../dtos';
import { ProjectLogEntity } from '../entities';
import { ProjectLogFactory } from '../factories';

@Injectable()
export class ProjectLogService {
  private logger = new Logger(ProjectLogService.name);

  constructor(
    @InjectRepository(ProjectLogEntity)
    private readonly repo: Repository<ProjectLogEntity>,
    private readonly factory: ProjectLogFactory,
    private readonly projectService: ProjectService
  ) {}

  public async findOneProjectLog(uuid: string): Promise<ProjectLogEntity> {
    return await this.repo.findOneBy({ uuid, deleted: false });
  }

  public async findAllProjectLogs(): Promise<ProjectLogEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async findProjectLogByProjectUUID(
    projectUUID: string
  ): Promise<ProjectLogEntity[]> {
    return await this.repo.findBy({
      project: { uuid: projectUUID },
      deleted: false,
    });
  }

  public async findOneProjectLogOrFail(
    uuid: string
  ): Promise<ProjectLogEntity> {
    try {
      return await this.repo.findOneByOrFail({ uuid, deleted: false });
    } catch {
      throw new NotFoundException('Project log not found.');
    }
  }

  public async createProjectLog({
    projectUUID,
    ...model
  }: CreateProjectLogDto): Promise<ProjectLogEntity> {
    const project: ProjectEntity =
      await this.projectService.findOneProjectOrFail(projectUUID, 'uuid');

    return await this.handleProjectLogSave(
      this.getProjectLogFromFactory(model, project)
    );
  }

  private getProjectLogFromFactory(
    model: Omit<CreateProjectLogDto, 'projectUUID'>,
    project: ProjectEntity
  ): ProjectLogEntity {
    try {
      return this.factory.createProjectLog(model, project);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleProjectLogSave(
    model: ProjectLogEntity
  ): Promise<ProjectLogEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to save project log.');
    }
  }

  public async addFileIdToProjectLog(
    model: ProjectLogEntity
  ): Promise<ProjectLogEntity> {
    if (!model.fileId) {
      throw new BadRequestException('Missing File Id');
    }

    return await this.handleProjectLogSave(model);
  }

  public async findProjectLogsByDate(
    arg: Date
  ): Promise<{ projectLogs: ProjectLogEntity[]; count: number }> {
    const { startOfLogDate, endOfLogDate } = getStartAndEndOfDate(arg);

    const [projectLogs, count] = await this.repo.findAndCountBy({
      logDate: Between(startOfLogDate, endOfLogDate),
      deleted: IsNull(),
    });

    return { projectLogs, count };
  }

  public async getProjectLogCountByProjectUUID(
    projectUUID: string
  ): Promise<number> {
    const projectLogs: ProjectLogEntity[] = await this.repo.findBy({
      deleted: false,
      project: { uuid: projectUUID },
    });

    return projectLogs?.length;
  }

  public async findProjectLogsByProjectUUID(
    projectUUID: string
  ): Promise<ProjectLogEntity[]> {
    return await this.repo.findBy({
      deleted: false,
      project: { uuid: projectUUID },
    });
  }
}
