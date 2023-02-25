import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../entities';
import {
  FindStudentQuery,
  StudentIdentificationProperties,
} from '../types/student.types';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>
  ) {}

  public async findOneStudent(
    value: string,
    property: StudentIdentificationProperties
  ): Promise<StudentEntity> {
    const query: FindStudentQuery = this.generateStudentQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findOneStudentOrFail(
    value: string,
    property: StudentIdentificationProperties
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
    property: StudentIdentificationProperties,
    deleted: boolean = false
  ): FindStudentQuery {
    return { [property]: value, deleted };
  }
}
