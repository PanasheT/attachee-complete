import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupervisorEntity } from '../entities';
import {
  FindSupervisorQuery,
  SupervisorIdentificationProperties,
} from '../types';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorEntity)
    private readonly repo: Repository<SupervisorEntity>
  ) {}

  public async findOneSupervsior(
    value: string,
    property: SupervisorIdentificationProperties
  ): Promise<SupervisorEntity> {
    const query: FindSupervisorQuery = this.generateFindQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findOneSupervisorOrFail(
    value: string,
    property: SupervisorIdentificationProperties
  ): Promise<SupervisorEntity> {
    try {
      const query: FindSupervisorQuery = this.generateFindQuery(
        value,
        property
      );
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('Supervisor not found');
    }
  }

  public async findAllSupervisors(): Promise<SupervisorEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  private generateFindQuery(
    value: string,
    property: SupervisorIdentificationProperties,
    deleted: boolean = false
  ): FindSupervisorQuery {
    return { [property]: value, deleted };
  }
}
