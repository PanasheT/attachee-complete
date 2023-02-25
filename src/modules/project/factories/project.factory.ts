import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities';


@Injectable()
export class ProjectFactory {
    constructor(
        @InjectRepository(ProjectEntity)
        private readonly repo: Repository<ProjectEntity>
    ) {}
}
