import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Daily-logEntity } from '../entities';

@Injectable()
export class Daily-logService {
    constructor(
        @InjectRepository(Daily-logEntity)
        private readonly repo: Repository<Daily-logEntity>,    
    ) {}
}
