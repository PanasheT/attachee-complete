import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectLogEntity } from '../entities';

@Injectable()
export class ProjectLogService {
  constructor(
    @InjectRepository(ProjectLogEntity)
    private readonly repo: Repository<ProjectLogEntity>
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
}
