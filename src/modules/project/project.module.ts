import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './controllers';
import { ProjectEntity } from './entities';
import { ProjectService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), ProjectModule],
  controllers: [ProjectController],
  exports: [ProjectService],
  providers: [ProjectService],
})
export class ProjectModule {}
