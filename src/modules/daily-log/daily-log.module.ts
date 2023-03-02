import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfModule } from '../pdf/pdf.module';
import { StudentModule } from '../student/student.module';
import { DailyLogController } from './controllers';
import { DailyLogEntity } from './entities';
import { DailyLogFactory } from './factories';
import { DailyLogService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyLogEntity]),
    StudentModule,
    PdfModule,
    DailyLogModule,
  ],
  controllers: [DailyLogController],
  exports: [DailyLogService],
  providers: [DailyLogService, DailyLogFactory],
})
export class DailyLogModule {}
