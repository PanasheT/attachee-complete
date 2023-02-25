import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../entities';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly repo: Repository<ProjectEntity>,    
    ) {}
}
