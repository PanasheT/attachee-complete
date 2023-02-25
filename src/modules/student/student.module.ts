import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './controllers';
import { StudentEntity } from './entities';
import { StudentFactory } from './factories';
import { StudentService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentController],
  exports: [StudentService],
  providers: [StudentService, StudentFactory],
})
export class StudentModule {}
