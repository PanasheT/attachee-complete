import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateSupervisorDto } from '../dtos';
import { SupervisorEntity } from '../entities';
import { SupervisorFactory } from '../factories';
import {
  FindSupervisorQuery,
  SupervisorIdentificationProperties,
} from '../types';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorEntity)
    private readonly repo: Repository<SupervisorEntity>,
    private readonly factory: SupervisorFactory
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
    deleted = false
  ): FindSupervisorQuery {
    return { [property]: value, deleted };
  }

  public async updateSupervisor(
    model: UpdateSupervisorDto,
    uuid: string
  ): Promise<SupervisorEntity> {
    const supervisor: SupervisorEntity = await this.findOneSupervisorOrFail(
      uuid,
      'uuid'
    );

    return await this.handleSupervisorSave(
      await this.getUpdatedSupervisorFromFactory(supervisor, model)
    );
  }

  private async getUpdatedSupervisorFromFactory(
    supervisor: SupervisorEntity,
    model: UpdateSupervisorDto
  ): Promise<SupervisorEntity> {
    try {
      return this.factory.updateSupervisor(model, supervisor);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleSupervisorSave(
    model: SupervisorEntity
  ): Promise<SupervisorEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save supervisor.');
    }
  }
}
