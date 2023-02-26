import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers';
import { CompanyEntity } from './entities';
import { CompanyFactory } from './factories';
import { CompanyService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompanyController],
  exports: [CompanyService],
  providers: [CompanyService, CompanyFactory],
})
export class CompanyModule {}
