import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/modules/company/entities';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { CreateStudentDto, UpdateStudentDto } from '../dtos';
import { StudentEntity } from '../entities';
import { FindStudentQuery } from '../types/student.types';

@Injectable()
export class StudentFactory {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>
  ) {}

  public async createStudent(model: CreateStudentDto): Promise<StudentEntity> {
    await this.assertStudentExists(model);
    return Object.assign(new StudentEntity(), model);
  }

  private async assertStudentExists(model: {
    regNumber?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    const deleted = false;
    const query: FindStudentQuery[] = [
      model.regNumber && { regNumber: model.regNumber, deleted },
      model.email && { email: model.email, deleted },
      model.phone && { phone: model.phone, deleted },
    ].filter(Boolean);

    if (query.length && (await this.repo.findOneBy(query))) {
      throw new BadRequestException('Student already exists.');
    }
  }

  public async updateStudent(
    model: UpdateStudentDto,
    student: StudentEntity
  ): Promise<StudentEntity> {
    const validatedDto: UpdateStudentDto = validateUpdate(student, model);
    await this.assertStudentExists(model);
    return Object.assign(student, validatedDto);
  }

  public addCompanyToStudent(
    student: StudentEntity,
    company: CompanyEntity
  ): StudentEntity {
    return Object.assign(student, { company });
  }
}
