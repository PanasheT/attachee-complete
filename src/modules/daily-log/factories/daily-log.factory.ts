import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Daily-logEntity } from '../entities';


@Injectable()
export class Daily-logFactory {
    constructor(
        @InjectRepository(Daily-logEntity)
        private readonly repo: Repository<Daily-logEntity>
    ) {}
}
