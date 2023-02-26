import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly repo: Repository<CompanyEntity>,    
    ) {}
}
