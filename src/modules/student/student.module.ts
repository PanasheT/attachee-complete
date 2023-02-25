import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './controllers';
import { StudentEntity } from './entities';
import { StudentService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([StudentEntity])],
  controllers: [StudentController],
  exports: [StudentService],
  providers: [StudentService],
})
export class StudentModule {}
