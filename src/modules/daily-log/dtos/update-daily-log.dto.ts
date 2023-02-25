import { PartialType, PickType } from '@nestjs/swagger';
import { CreateDailyLogDto } from './create-daily-log.dto';

export class UpdateDailyLogDto extends PartialType(
  PickType(CreateDailyLogDto, [
    'checkIn',
    'checkOut',
    'comment',
    'description',
    'difficulties',
  ] as const)
) {}
