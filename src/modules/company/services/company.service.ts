import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from '../dtos';
import { CompanyEntity } from '../entities';
import { CompanyFactory } from '../factories';
import {
  CompanyIdentificationProperties,
  FindCompanyQuery,
} from '../types/company.types';

@Injectable()
export class CompanyService {
  private logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
    private readonly factory: CompanyFactory
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

  public async createCompany(model: CreateCompanyDto): Promise<CompanyEntity> {
    return await this.handleCompanySave(
      await this.getCompanyFromFactory(model)
    );
  }

  private async getCompanyFromFactory(
    model: CreateCompanyDto
  ): Promise<CompanyEntity> {
    try {
      return await this.factory.createCompany(model);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleCompanySave(
    model: CompanyEntity
  ): Promise<CompanyEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create company');
    }
  }
}
