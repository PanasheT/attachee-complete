import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../student/student.module';
import { TaskController } from './controllers';
import { TaskEntity } from './entities';
import { TaskFactory } from './factories';
import { TaskService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity]), StudentModule],
  controllers: [TaskController],
  exports: [TaskService],
  providers: [TaskService, TaskFactory],
})
export class TaskModule {}
