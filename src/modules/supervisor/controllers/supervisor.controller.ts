import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupervisorService } from '../services';

@Controller('supervisors')
@ApiTags('supervisors')
export class SupervisorController {
  constructor(private readonly service: SupervisorService) {}
}
