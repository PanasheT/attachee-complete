import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Daily-logService } from '../services';

@Controller('daily-logs')
@ApiTags('daily-logs')
export class Daily-logController {
    constructor(private readonly service: Daily-logService) {}
}
