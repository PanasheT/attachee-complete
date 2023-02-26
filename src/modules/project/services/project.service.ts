import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { Repository } from 'typeorm';
import { CreateProjectDto, UpdateProjectDto } from '../dtos';
import { ProjectEntity } from '../entities';
import { ProjectFactory } from '../factories';
import {
  FindProjectQuery,
  ProjectIdentificationProperties as ProjectIdProps,
} from '../types';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly repo: Repository<ProjectEntity>,
    private readonly factory: ProjectFactory,
    private readonly studentService: StudentService
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

  public async createProject({
    studentUUID,
    ...model
  }: CreateProjectDto): Promise<ProjectEntity> {
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    return await this.handleProjectSave(
      await this.getProjectFromFactory(model, student)
    );
  }

  private async getProjectFromFactory(
    model: Omit<CreateProjectDto, 'studentUUID'>,
    student: StudentEntity
  ): Promise<ProjectEntity> {
    try {
      return await this.factory.createProject(model, student);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleProjectSave(
    model: ProjectEntity
  ): Promise<ProjectEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create project.');
    }
  }

  public async updateProject(
    uuid: string,
    model: UpdateProjectDto
  ): Promise<ProjectEntity> {
    const project: ProjectEntity = await this.findOneProjectOrFail(
      uuid,
      'uuid'
    );

    return await this.handleProjectSave(
      await this.getUpdatedProjectFromFactory(model, project)
    );
  }

  private async getUpdatedProjectFromFactory(
    model: UpdateProjectDto,
    project: ProjectEntity
  ): Promise<ProjectEntity> {
    try {
      return await this.factory.updateProject(model, project);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }
}
