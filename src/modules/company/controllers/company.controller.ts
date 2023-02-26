import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific company by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Company successfully updated.',
    type: CompanyDto,
  })
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
}
