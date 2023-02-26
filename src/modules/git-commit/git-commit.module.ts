import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GitCommitController } from './controllers';
import { GitCommitEntity } from './entities';
import { GitCommitService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([GitCommitEntity])],
  controllers: [GitCommitController],
  exports: [GitCommitService],
  providers: [GitCommitService],
})
export class GitCommitModule {}
