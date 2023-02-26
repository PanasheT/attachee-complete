import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './controllers';
import { CompanyService } from './services';
import { CompanyEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([CompanyEntity])],
    controllers: [CompanyController],
    exports: [CompanyService],
    providers: [CompanyService],
})
export class CompanyModule {}
