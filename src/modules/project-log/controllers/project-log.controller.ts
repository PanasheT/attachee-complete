import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProjectLogService } from '../services';

@Controller('project-logs')
@ApiTags('project-logs')
export class ProjectLogController {
  constructor(private readonly service: ProjectLogService) {}
}
