import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/modules/company/entities';
import { Repository } from 'typeorm';
import { CreateStudentDto, UpdateStudentDto } from '../dtos';
import { StudentEntity } from '../entities';
import { StudentFactory } from '../factories';
import {
  FindStudentQuery,
  StudentIdentificationProperties as StudentIdProps,
} from '../types/student.types';

@Injectable()
export class StudentService {
  private logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>,
    private readonly factory: StudentFactory
  ) {}

  public async findOneStudent(
    value: string,
    property: StudentIdProps
  ): Promise<StudentEntity> {
    const query: FindStudentQuery = this.generateStudentQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findOneStudentOrFail(
    value: string,
    property: StudentIdProps
  ): Promise<StudentEntity> {
    try {
      const query: FindStudentQuery = this.generateStudentQuery(
        value,
        property
      );
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('Student not found.');
    }
  }

  public async findAllStudents(): Promise<StudentEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  private generateStudentQuery(
    value: string,
    property: StudentIdProps,
    deleted = false
  ): FindStudentQuery {
    return { [property]: value, deleted };
  }

  public async createStudent(model: CreateStudentDto): Promise<StudentEntity> {
    return await this.handleStudentSave(
      await this.getStudentFromFactory(model)
    );
  }

  private async getStudentFromFactory(
    model: CreateStudentDto
  ): Promise<StudentEntity> {
    try {
      return await this.factory.createStudent(model);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleStudentSave(
    model: StudentEntity
  ): Promise<StudentEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create student.');
    }
  }

  public async updateStudent(
    uuid: string,
    model: UpdateStudentDto
  ): Promise<StudentEntity> {
    const student: StudentEntity = await this.findOneStudentOrFail(
      uuid,
      'uuid'
    );

    return await this.handleStudentSave(
      await this.getUpdatedStudentFromFactory(model, student)
    );
  }

  private async getUpdatedStudentFromFactory(
    model: UpdateStudentDto,
    student: StudentEntity
  ): Promise<StudentEntity> {
    try {
      return await this.factory.updateStudent(model, student);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  public async addCompanyToStudent(
    model: StudentEntity,
    company: CompanyEntity
  ): Promise<StudentEntity> {
    const student: StudentEntity = this.factory.addCompanyToStudent(
      model,
      company
    );

    return await this.handleStudentSave(student);
  }

  public async removeCompanyFromStudent(
    model: StudentEntity
  ): Promise<StudentEntity> {
    const student: StudentEntity = this.factory.removeCompanyFromStudent(model);
    return await this.handleStudentSave(student);
  }
}
