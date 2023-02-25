import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLogController } from './controllers';
import { DailyLogEntity } from './entities';
import { DailyLogService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DailyLogEntity])],
  controllers: [DailyLogController],
  exports: [DailyLogService],
  providers: [DailyLogService],
})
export class DailyLogModule {}
