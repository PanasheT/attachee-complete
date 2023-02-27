import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateProjectLogDto } from '../dtos';
import { ProjectLogEntity } from '../entities';
import { ProjectLogService } from '../services';

@Controller('project-logs')
@ApiTags('project-logs')
export class ProjectLogController {
  constructor(private readonly service: ProjectLogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project log.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Project log successfully created.',
  })
  public async createProjectLog(
    @Body() model: CreateProjectLogDto
  ): Promise<ProjectLogEntity> {
    return await this.service.createProjectLog(model);
  }
}
