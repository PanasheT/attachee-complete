import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupervisorEntity } from '../entities';

@Injectable()
export class SupervisorFactory {
  constructor(
    @InjectRepository(SupervisorEntity)
    private readonly repo: Repository<SupervisorEntity>
  ) {}
}
