import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../student/student.module';
import { DailyLogController } from './controllers';
import { DailyLogEntity } from './entities';
import { DailyLogFactory } from './factories';
import { DailyLogService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([DailyLogEntity]), StudentModule],
  controllers: [DailyLogController],
  exports: [DailyLogService],
  providers: [DailyLogService, DailyLogFactory],
})
export class DailyLogModule {}
