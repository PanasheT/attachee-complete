import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entities';


@Injectable()
export class TaskFactory {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly repo: Repository<TaskEntity>
    ) {}
}
