import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectLogController } from './controllers';
import { ProjectLogEntity } from './entities';
import { ProjectLogFactory } from './factories';
import { ProjectLogService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectLogEntity]), ProjectLogModule],
  controllers: [ProjectLogController],
  exports: [ProjectLogService],
  providers: [ProjectLogService, ProjectLogFactory],
})
export class ProjectLogModule {}
