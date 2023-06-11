import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Response } from 'express';
import * as moment from 'moment';
import { PdfService } from 'src/modules/pdf/services/pdf.service';
import { Readable } from 'stream';
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
  constructor(
    private readonly service: ProjectLogService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a project log.' })
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
  public async findAllProjectLogs(): Promise<ProjectLogDto[]> {
    const projectLogs = await this.service.findAllProjectLogs();
    return projectLogs.map(ProjectLogDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific project log by uuid.' })
  public async findOneProjectLog(
    @Param('uuid') uuid: string
  ): Promise<ProjectLogDto> {
    const projectlog = await this.service.findOneProjectLogOrFail(uuid);
    return ProjectLogDtoFactory(projectlog);
  }

  @Get('project/:projectUUID')
  @ApiOperation({ summary: 'Retrieve project logs by project uuid.' })
  public async findProjectLogsByProjectUUID(
    @Param('projectUUID') projectUUID: string
  ): Promise<ProjectLogDto[]> {
    if (!isUUID(projectUUID)) {
      throw new BadRequestException('Invalid uuid.');
    }
    const projectLogs: ProjectLogEntity[] =
      await this.service.findProjectLogsByProjectUUID(projectUUID);
    return projectLogs.map(ProjectLogDtoFactory);
  }

  @Get(':uuid/summary')
  @ApiOperation({ summary: 'Generate a pdf summary for a project log.' })
  public async generateProjectLogPdfSummary(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const projectLog: ProjectLogEntity =
      await this.service.findOneProjectLogOrFail(uuid);

    const buffer = await this.pdfService.generatePdfByType(
      projectLog,
      'projectLog'
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
      'Content-Disposition': `attachment; filename="project_log_${
        projectLog.project.name
      }_${moment(projectLog.logDate).format('DD/MM/YY')}.pdf"`,
    });

    return stream.pipe(response);
  }

  @Get('count/:projectUUID')
  @ApiOperation({
    summary: 'Get the number of project logs recorded by project UUID.',
  })
  public async getProjectLogCountByProjectUUID(
    @Param('projectUUID') projectUUID: string
  ): Promise<number> {
    if (!isUUID(projectUUID)) {
      throw new BadRequestException('Invalid uuid.');
    }

    return await this.service.getProjectLogCountByProjectUUID(projectUUID);
  }

  @Get('student/:studentUUID')
  @ApiOperation({ summary: 'Retrieve project logs by student UUID.' })
  public async findProjectLogsByStudentUUID(
    @Param('studentUUID') studentUUID: string
  ): Promise<ProjectLogDto[]> {
    const projectLogs: ProjectLogEntity[] =
      await this.service.findProjectLogsByStudentUUID(studentUUID);
    return projectLogs.map(ProjectLogDtoFactory);
  }

  @Delete(':uuid/:studentUUID')
  @ApiOperation({ summary: "Delete a project log by uuid"})
  public async deleteProjectLogByUUID(@Param('uuid') uuid: string, @Param('studentUUID') studentUUID: string): Promise<void> {
    if (!isUUID(studentUUID) || !isUUID(uuid)) {
      throw new BadRequestException("Invalid uuid's")
    }

    await this.service.deleteProjectLogByUUID(uuid, studentUUID)
  }
}
