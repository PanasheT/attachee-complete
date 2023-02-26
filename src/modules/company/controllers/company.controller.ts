import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyService } from '../services';

@Controller('companys')
@ApiTags('companys')
export class CompanyController {
    constructor(private readonly service: CompanyService) {}
}
