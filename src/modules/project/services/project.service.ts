import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities';
import {
  FindProjectQuery,
  ProjectIdentificationProperties as ProjectIdProps,
} from '../types';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>
  ) {}

  public async findOneProject(
    value: string,
    property: ProjectIdProps
  ): Promise<ProjectEntity> {
    const query: FindProjectQuery = this.generateFindQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findAllProjects(): Promise<ProjectEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async findOneProjectOrFail(
    value: string,
    property: ProjectIdProps
  ): Promise<ProjectEntity> {
    try {
      const query: FindProjectQuery = this.generateFindQuery(value, property);
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('Project not found.');
    }
  }

  private generateFindQuery(
    value: string,
    property: ProjectIdProps,
    deleted = false
  ): FindProjectQuery {
    return { [property]: value, deleted };
  }
}
