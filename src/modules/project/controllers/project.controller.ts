import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { PdfService } from 'src/modules/pdf/services';
import { Readable } from 'stream';
import {
  CreateProjectDto,
  ProjectDto,
  ProjectDtoFactory,
  UpdateProjectDto,
} from '../dtos';
import { ProjectEntity } from '../entities';
import { ProjectService } from '../services';

@Controller('projects')
@ApiTags('projects')
export class ProjectController {
  constructor(
    private readonly service: ProjectService,
    private readonly pdfService: PdfService
  ) {}

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

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific project by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project successfully updated.',
    type: ProjectDto,
  })
  public async updateProject(
    @Param('uuid') uuid: string,
    @Body() model: UpdateProjectDto
  ): Promise<ProjectDto> {
    const updatedProject: ProjectEntity = await this.service.updateProject(
      uuid,
      model
    );

    return ProjectDtoFactory(updatedProject);
  }

  @Get(':uuid/summary')
  @ApiOperation({ summary: 'Get a summary of the projetc as a pdf.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Project details pdf successfully created.',
  })
  @Header('content-type', 'application/pdf')
  public async getProjectDetailsPdf(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const project: ProjectEntity = await this.service.findOneProjectOrFail(
      uuid,
      'uuid'
    );

    const buffer = await this.pdfService.generatePdfByType(
      project,
      'projectDetails'
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
    });

    return stream.pipe(response);
  }
}
