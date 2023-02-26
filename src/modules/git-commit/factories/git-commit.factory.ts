import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GitCommitEntity } from '../entities';

@Injectable()
export class GitCommitFactory {
  constructor(
    @InjectRepository(GitCommitEntity)
    private readonly repo: Repository<GitCommitEntity>
  ) {}
}
