import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from '../entities';

@Injectable()
export class StudentFactory {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly repo: Repository<StudentEntity>
  ) {}
}
