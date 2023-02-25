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
import { CreateProjectDto, ProjectDto, ProjectDtoFactory } from '../dtos';
import { ProjectEntity } from '../entities';
import { ProjectService } from '../services';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a project.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Project successfully created.',
    type: ProjectDto,
  })
  public async createProject(
    @Body() model: CreateProjectDto
  ): Promise<ProjectDto> {
    const project: ProjectEntity = await this.service.createProject(model);
    return ProjectDtoFactory(project);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all projects.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Projects successfully retrieved.',
    type: [ProjectDto],
  })
  public async findAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.service.findAllProjects();
    return projects.map(ProjectDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific project by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'Project successfully retrieved.',
    type: ProjectDto,
  })
  public async findOneProject(
    @Param('uuid') uuid: string
  ): Promise<ProjectDto> {
    const project = await this.service.findOneProjectOrFail(uuid, 'uuid');
    return ProjectDtoFactory(project);
  }
}
