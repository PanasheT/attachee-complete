import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdfModule } from '../pdf/pdf.module';
import { StudentModule } from '../student/student.module';
import { ProjectController } from './controllers';
import { ProjectEntity } from './entities';
import { ProjectFactory } from './factories';
import { ProjectService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity]),
    StudentModule,
    PdfModule,
  ],
  controllers: [ProjectController],
  exports: [ProjectService],
  providers: [ProjectService, ProjectFactory],
})
export class ProjectModule {}
