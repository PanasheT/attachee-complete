import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from '../entities';
import {
  CompanyIdentificationProperties,
  FindCompanyQuery,
} from '../types/company.types';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>
  ) {}

  public async findOneCompany(
    value: string,
    property: CompanyIdentificationProperties
  ): Promise<CompanyEntity> {
    const query: FindCompanyQuery = this.generateFindQuery(value, property);
    return query ? await this.repo.findOneBy(query) : undefined;
  }

  public async findOneCompanyOrFail(
    value: string,
    property: CompanyIdentificationProperties
  ): Promise<CompanyEntity> {
    try {
      const query: FindCompanyQuery = this.generateFindQuery(value, property);
      return query ? await this.repo.findOneByOrFail(query) : undefined;
    } catch {
      throw new NotFoundException('Company not found.');
    }
  }

  public async findAllCompanies(): Promise<CompanyEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  private generateFindQuery(
    value: string,
    property: CompanyIdentificationProperties,
    deleted: boolean = false
  ): FindCompanyQuery {
    return { [property]: value, deleted };
  }
}
