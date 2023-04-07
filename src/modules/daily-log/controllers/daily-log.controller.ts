import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import * as moment from 'moment';
import { PdfService } from 'src/modules/pdf/services/pdf.service';
import { Readable } from 'stream';
import {
  CreateDailyLogDto,
  DailyLogDto,
  DailyLogDtoFactory,
  UpdateDailyLogDto,
} from '../dtos';
import { DailyLogEntity } from '../entities';
import { DailyLogService } from '../services';

@Controller('daily-logs')
@ApiTags('daily-logs')
export class DailyLogController {
  constructor(
    private readonly service: DailyLogService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a daily log.' })
  public async createDailyLog(
    @Body() model: CreateDailyLogDto
  ): Promise<DailyLogDto> {
    const dailyLog: DailyLogEntity = await this.service.createDailyLog(model);
    console.log(dailyLog);
    return DailyLogDtoFactory(dailyLog);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all daily logs.' })
  public async findAllDailyLogs(): Promise<DailyLogDto[]> {
    const dailyLogs = await this.service.findAllDailyLogs();
    return dailyLogs.map(DailyLogDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific daily log by uuid.' })
  public async findOneDailyLog(
    @Param('uuid') uuid: string
  ): Promise<DailyLogDto> {
    const dailyLog = await this.service.findOneDailyLogOrFail(uuid);
    return DailyLogDtoFactory(dailyLog);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific daily log by uuid.' })
  public async updateDailyLog(
    @Param('uuid') uuid: string,
    @Body() model: UpdateDailyLogDto
  ): Promise<DailyLogDto> {
    const updatedDailyLog: DailyLogEntity = await this.service.updateDailyLog(
      uuid,
      model
    );

    return DailyLogDtoFactory(updatedDailyLog);
  }

  @Get(':uuid/summary')
  @ApiOperation({ summary: 'Generate a pdf summary for a daily log.' })
  public async generateProjectLogPdfSummary(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const dailyLog: DailyLogEntity = await this.service.findOneDailyLogOrFail(
      uuid
    );

    if (!dailyLog.student.company) {
      throw new NotAcceptableException('Student has no company assigned.');
    }

    const buffer: Buffer = await this.pdfService.generatePdfByType(
      dailyLog,
      'dailyLog'
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
      'Content-Disposition': `attachment; filename="daily_log_${moment(
        dailyLog.checkIn
      ).format('DD_MM_YY')}.pdf"`,
    });

    return stream.pipe(response);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Mark a daily log as deleted' })
  public async deleteDailyLog(@Param('uuid') uuid: string): Promise<void> {
    await this.service.deleteDailyLog(uuid);
  }
}
