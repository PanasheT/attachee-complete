import { BadRequestException, Injectable } from '@nestjs/common';
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
    let hoursWorked: number = model.tasks.reduce(
      (a, b) => a + b.hoursWorked,
      0
    );

    if (hoursWorked <= 0) {
      throw new BadRequestException('Invalid number of hours worked.');
    }

    return Object.assign(new ProjectLogEntity(), {
      ...model,
      project,
      hoursWorked,
    });
  }
}
