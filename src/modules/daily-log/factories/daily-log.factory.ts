import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyLogEntity } from '../entities';

@Injectable()
export class DailyLogFactory {
  constructor(
    @InjectRepository(DailyLogEntity)
    private readonly repo: Repository<DailyLogEntity>
  ) {}
}