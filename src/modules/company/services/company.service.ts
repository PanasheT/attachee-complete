import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { Repository } from 'typeorm';
import { CreateCompanyDto, UpdateCompanyDto } from '../dtos';
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
    private readonly factory: CompanyFactory,
    private readonly studentService: StudentService
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
    deleted = false
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

  public async updateCompany(
    uuid: string,
    model: UpdateCompanyDto
  ): Promise<CompanyEntity> {
    const company: CompanyEntity = await this.findOneCompanyOrFail(
      uuid,
      'uuid'
    );

    return await this.handleCompanySave(
      await this.getUpdatedCompanyFromFactory(model, company)
    );
  }

  private async getUpdatedCompanyFromFactory(
    model: UpdateCompanyDto,
    company: CompanyEntity
  ): Promise<CompanyEntity> {
    try {
      return await this.factory.updateCompany(model, company);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  public async addUnattachedStudentToCompany(
    uuid: string,
    studentUUID: string
  ): Promise<void> {
    const company: CompanyEntity = await this.findOneCompanyOrFail(
      uuid,
      'uuid'
    );
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    if (student.company) {
      throw new NotAcceptableException('Student is already attached.');
    }

    await this.studentService.addCompanyToStudent(student, company);
  }
}
