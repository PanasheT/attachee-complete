import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { Repository } from 'typeorm';
import { CreateProjectDto } from '../dtos';
import { ProjectEntity } from '../entities';

@Injectable()
export class ProjectFactory {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>
  ) {}

  public async createProject(
    model: Omit<CreateProjectDto, 'studentUUID'>,
    student: StudentEntity
  ): Promise<ProjectEntity> {
    await this.assertProjectExists(model.name, student.uuid);
    return Object.assign(new ProjectEntity(), model);
  }

  private async assertProjectExists(
    name: string,
    studentUUID: string
  ): Promise<void> {
    const project: ProjectEntity = await this.repo.findOneBy({
      student: { uuid: studentUUID },
      name,
    });

    if (project) {
      throw new BadRequestException('Project already exists.');
    }
  }
}
