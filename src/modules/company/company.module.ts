import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentModule } from '../student/student.module';
import { CompanyController } from './controllers';
import { CompanyEntity } from './entities';
import { CompanyFactory } from './factories';
import { CompanyService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), StudentModule],
  controllers: [CompanyController],
  exports: [CompanyService],
  providers: [CompanyService, CompanyFactory],
})
export class CompanyModule {}
