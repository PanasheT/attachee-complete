import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDailyLogDto, DailyLogDto, DailyLogDtoFactory } from '../dtos';
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
}
