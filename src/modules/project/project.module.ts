import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './controllers';
import { ProjectService } from './services';
import { ProjectEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectEntity])],
    controllers: [ProjectController],
    exports: [ProjectService],
    providers: [ProjectService],
})
export class ProjectModule {}
