import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLogSubscriber } from 'src/subscribers';
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
  ],
  controllers: [DailyLogController],
  exports: [DailyLogService],
  providers: [DailyLogService, DailyLogFactory, DailyLogSubscriber],
})
export class DailyLogModule {}
