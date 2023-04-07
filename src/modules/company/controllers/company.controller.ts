import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CompanyDto,
  CompanyDtoFactory,
  CreateCompanyDto,
  UpdateCompanyDto,
} from '../dtos';
import { CompanyEntity } from '../entities';
import { CompanyService } from '../services';

@Controller('companies')
@ApiTags('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company.' })
  public async createCompany(
    @Body() model: CreateCompanyDto
  ): Promise<CompanyDto> {
    const company: CompanyEntity = await this.service.createCompany(model);

    return CompanyDtoFactory(company);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all companies.' })
  public async findAllCompanies(): Promise<CompanyDto[]> {
    const companies = await this.service.findAllCompanies();
    return companies.map(CompanyDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific company by uuid.' })
  public async findOneCompany(
    @Param('uuid') uuid: string
  ): Promise<CompanyDto> {
    const company = await this.service.findOneCompanyOrFail(uuid, 'uuid');
    return CompanyDtoFactory(company);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific company by uuid.' })
  public async updateCompany(
    @Param('uuid') uuid: string,
    @Body() model: UpdateCompanyDto
  ): Promise<CompanyDto> {
    const updatedCompany: CompanyEntity = await this.service.updateCompany(
      uuid,
      model
    );

    return CompanyDtoFactory(updatedCompany);
  }

  @Put(':uuid/student/:studentUUID')
  @ApiOperation({ summary: 'Add a student to a company.' })
  public async addStudentToCompany(
    @Param('uuid') uuid: string,
    @Param('studentUUID') studentUUID: string
  ): Promise<void> {
    await this.service.addUnattachedStudentToCompany(uuid, studentUUID);
  }

  @Put(':uuid/student/:studentUUID/remove')
  @ApiOperation({ summary: 'Remove a student from a company.' })
  public async removeStudentFromCompany(
    @Param('uuid') uuid: string,
    @Param('studentUUID') studentUUID: string
  ): Promise<void> {
    await this.service.removeStudentFromCompany(uuid, studentUUID);
  }
}
