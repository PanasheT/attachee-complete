import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectLogEntity } from '../entities';

@Injectable()
export class ProjectLogFactory {
  constructor(
    @InjectRepository(ProjectLogEntity)
    private readonly repo: Repository<ProjectLogEntity>
  ) {}
}
