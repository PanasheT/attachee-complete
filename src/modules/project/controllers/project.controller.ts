import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
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
  public async createProject(
    @Body() model: CreateProjectDto
  ): Promise<ProjectDto> {
    console.log('here');
    const project: ProjectEntity = await this.service.createProject(model);
    return ProjectDtoFactory(project);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all projects.' })
  public async findAllProjects(): Promise<ProjectDto[]> {
    const projects = await this.service.findAllProjects();
    return projects.map(ProjectDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific project by uuid.' })
  public async findOneProject(
    @Param('uuid') uuid: string
  ): Promise<ProjectDto> {
    const project = await this.service.findOneProjectOrFail(uuid, 'uuid');
    return ProjectDtoFactory(project);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific project by uuid.' })
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
  public async getProjectDetailsPdf(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const project: ProjectEntity = await this.service.findOneProjectOrFail(
      uuid,
      'uuid'
    );

    const buffer: Buffer = await this.pdfService.generatePdfByType(
      project,
      'projectDetails'
    );

    if (!buffer) {
      return null;
    }

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
      'Content-Disposition': `attachment; filename="project_details_${project.name}"`,
    });

    return stream.pipe(response);
  }

  @Delete(':uuid/:studentUUID')
  @ApiOperation({ summary: 'Delete a project by uuid and studentUUID' })
  public async deleteProjectByUUID(
    @Param('uuid') uuid: string,
    @Param('studentUUID') studentUUID: string
  ): Promise<void> {
    if (!isUUID(studentUUID) || !isUUID(uuid)) {
      throw new BadRequestException('Invalid uuid');
    }

    await this.service.deleteProjectByUUID(uuid, studentUUID);
  }

  @Get('student/:studentUUID')
  @ApiOperation({ summary: 'Get projects by student UUID' })
  public async findProjectsByStudentUUID(
    @Param('studentUUID') studentUUID
  ): Promise<ProjectDto[]> {
    const projects: ProjectEntity[] =
      await this.service.findProjectsByStudentUUID(studentUUID);
    return projects.map(ProjectDtoFactory);
  }
}
