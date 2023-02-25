import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dtos';
import { StudentEntity } from '../entities';

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

  private async assertStudentExists({
    regNumber,
    email,
    phone,
  }: CreateStudentDto): Promise<void> {
    const deleted: boolean = false;
    const query = [
      { regNumber, deleted },
      { email, deleted },
      { phone, deleted },
    ];

    if (await this.repo.findOneBy(query)) {
      throw new BadRequestException('Student already exists.');
    }
  }
}
