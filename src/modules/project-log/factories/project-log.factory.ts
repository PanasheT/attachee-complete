import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from 'src/modules/project/entities';
import { Repository } from 'typeorm';
import { CreateProjectLogDto } from '../dtos';
import { ProjectLogEntity } from '../entities';

@Injectable()
export class ProjectLogFactory {
  constructor(
    @InjectRepository(ProjectLogEntity)
    private readonly repo: Repository<ProjectLogEntity>
  ) {}

  public createProjectLog(
    model: Omit<CreateProjectLogDto, 'projectUUID'>,
    project: ProjectEntity
  ): ProjectLogEntity {
    return Object.assign(new ProjectLogEntity(), { ...model, project });
  }
}
