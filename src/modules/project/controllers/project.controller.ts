import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectService } from '../services';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}
}
