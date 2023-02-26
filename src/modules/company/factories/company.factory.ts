import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from '../entities';


@Injectable()
export class CompanyFactory {
    constructor(
        @InjectRepository(CompanyEntity)
        private readonly repo: Repository<CompanyEntity>
    ) {}
}
