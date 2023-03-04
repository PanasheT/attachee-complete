import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupervisorEntity } from 'src/modules/supervisor/entities';
import { SupervisorFactory } from 'src/modules/supervisor/factories';
import { SupervisorService } from 'src/modules/supervisor/services';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { CreateCompanyDto, UpdateCompanyDto } from '../dtos';
import { CompanyEntity } from '../entities';

@Injectable()
export class CompanyFactory {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly repo: Repository<CompanyEntity>,
    private readonly supervisorService: SupervisorService,
    private readonly supervisorFactory: SupervisorFactory
  ) {}

  public async createCompany({
    supervisor,
    ...model
  }: CreateCompanyDto): Promise<CompanyEntity> {
    await this.assertCompanyExists(model.name);

    const supervisorEntity: SupervisorEntity =
      await this.supervisorFactory.createSupervisor(supervisor);

    return Object.assign(new CompanyEntity(), {
      model,
      supervisor: supervisorEntity,
    });
  }

  private async assertCompanyExists(name: string): Promise<void> {
    const company: CompanyEntity = await this.repo.findOneBy({
      name,
      deleted: false,
    });

    if (company) {
      throw new NotAcceptableException('Company already exists');
    }
  }

  public async updateCompany(
    model: UpdateCompanyDto,
    company: CompanyEntity
  ): Promise<CompanyEntity> {
    const validatedDto: Partial<CompanyEntity> = validateUpdate(model, company);

    if (validatedDto?.name) {
      this.assertCompanyExists(validatedDto.name);
    }

    return Object.assign(company, validatedDto);
  }
}
