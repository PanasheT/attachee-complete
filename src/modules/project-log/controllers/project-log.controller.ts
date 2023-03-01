import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import * as fs from 'fs';
import * as moment from 'moment';
import { GoogleDriveService } from 'src/modules/google-drive/services';
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
    private readonly pdfService: PdfService,
    private readonly googleDriveService: GoogleDriveService
  ) {}

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

    await this.pdfService.saveAndUploadProjectLogToDrive(projectLog);

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

  @Get(':uuid/summary')
  @ApiOperation({ summary: 'Generate a pdf summary for a project log.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'PDF successfully generated',
  })
  @Header('content-type', 'application/pdf')
  public async generateProjectLogPdfSummary(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const projectLog: ProjectLogEntity =
      await this.service.findOneProjectLogOrFail(uuid);

    const buffer = await this.pdfService.generateProjectLogPdf(projectLog);
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    const fileName: string = `school_assessment_form_${moment(
      projectLog.logDate
    ).format('DD_MM_YYYY')}`;

    fs.writeFileSync(`PDF_LOGS/projects/${fileName}.pdf`, buffer);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
    });

    return stream.pipe(response);
  }
}
