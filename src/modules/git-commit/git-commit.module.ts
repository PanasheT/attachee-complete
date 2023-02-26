import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyLogModule } from '../daily-log/daily-log.module';
import { GitCommitController } from './controllers';
import { GitCommitEntity } from './entities';
import { GitCommitFactory } from './factories';
import { GitCommitService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([GitCommitEntity]), DailyLogModule],
  controllers: [GitCommitController],
  exports: [GitCommitService],
  providers: [GitCommitService, GitCommitFactory],
})
export class GitCommitModule {}
