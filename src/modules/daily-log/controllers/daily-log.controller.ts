import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DailyLogService } from '../services';

@Controller('daily-logs')
@ApiTags('daily-logs')
export class DailyLogController {
  constructor(private readonly service: DailyLogService) {}
}
