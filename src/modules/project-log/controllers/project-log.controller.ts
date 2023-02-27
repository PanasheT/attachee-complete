import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateProjectLogDto,
  ProjectLogDto,
  ProjectLogDtoFactory,
} from '../dtos';
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
  ): Promise<ProjectLogDto> {
    const projectLog: ProjectLogEntity = await this.service.createProjectLog(
      model
    );

    return ProjectLogDtoFactory(projectLog);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all project logs.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'ProjectLogs successfully retrieved.',
    type: [ProjectLogDto],
  })
  public async findAllProjectLogs(): Promise<ProjectLogDto[]> {
    const projectLogs = await this.service.findAllProjectLogs();
    return projectLogs.map(ProjectLogDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific project log by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'ProjectLog successfully retrieved.',
    type: ProjectLogDto,
  })
  public async findOneProjectLog(
    @Param('uuid') uuid: string
  ): Promise<ProjectLogDto> {
    const projectlog = await this.service.findOneProjectLogOrFail(uuid);
    return ProjectLogDtoFactory(projectlog);
  }
}
