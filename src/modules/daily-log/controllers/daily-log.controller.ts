import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  constructor(private readonly service: DailyLogService) {}

  @Post()
  @ApiOperation({ summary: 'Create a daily log.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Daily log successfully created.',
    type: DailyLogDto,
  })
  public async createDailyLog(
    @Body() model: CreateDailyLogDto
  ): Promise<DailyLogDto> {
    const dailyLog: DailyLogEntity = await this.service.createDailyLog(model);
    return DailyLogDtoFactory(dailyLog);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all daily logs.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Daily logs successfully retrieved.',
    type: [DailyLogDto],
  })
  public async findAllDailyLogs(): Promise<DailyLogDto[]> {
    const dailyLogs = await this.service.findAllDailyLogs();
    return dailyLogs.map(DailyLogDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific daily log by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({
    description: 'Daily log successfully retrieved.',
    type: DailyLogDto,
  })
  public async findOneDailyLog(
    @Param('uuid') uuid: string
  ): Promise<DailyLogDto> {
    const dailyLog = await this.service.findOneDailyLogOrFail(uuid);
    return DailyLogDtoFactory(dailyLog);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific daily log by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Daily log updated successfully.',
    type: DailyLogDto,
  })
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
}
