import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/modules/project/entities';
import { ProjectService } from 'src/modules/project/services';
import { Repository } from 'typeorm';
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

  public async createProjectLog(
    model: CreateProjectLogDto
  ): Promise<ProjectLogEntity> {
    return;
  }

  public getProjectLogFromFactory(
    model: Omit<CreateProjectLogDto, 'projectUUID'>,
    project: ProjectEntity
  ): ProjectLogEntity {
    try {
      return this.factory.createProjectLog(model, project);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  public async handleProjectLogSave(
    model: ProjectLogEntity
  ): Promise<ProjectLogEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to save project log.');
    }
  }
}
