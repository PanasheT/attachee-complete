import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from '../project/project.module';
import { ProjectLogController } from './controllers';
import { ProjectLogEntity } from './entities';
import { ProjectLogFactory } from './factories';
import { ProjectLogService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectLogEntity]), ProjectModule],
  controllers: [ProjectLogController],
  exports: [ProjectLogService],
  providers: [ProjectLogService, ProjectLogFactory],
})
export class ProjectLogModule {}
