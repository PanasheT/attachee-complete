import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
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
