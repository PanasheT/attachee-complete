import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { PdfModule } from '../pdf/pdf.module';
import { StudentController } from './controllers';
import { StudentEntity } from './entities';
import { StudentFactory } from './factories';
import { StudentService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentEntity]),
    PdfModule,
    GoogleDriveModule,
  ],
  controllers: [StudentController],
  exports: [StudentService, StudentFactory],
  providers: [StudentService, StudentFactory],
})
export class StudentModule {}
