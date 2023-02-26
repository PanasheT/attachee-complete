import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyDto, CompanyDtoFactory, CreateCompanyDto } from '../dtos';
import { CompanyEntity } from '../entities';
import { CompanyService } from '../services';

@Controller('companies')
@ApiTags('companies')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Company created successfully',
    type: CompanyDto,
  })
  public async createCompany(
    @Body() model: CreateCompanyDto
  ): Promise<CompanyDto> {
    const company: CompanyEntity = await this.service.createCompany(model);

    return CompanyDtoFactory(company);
  }
}
