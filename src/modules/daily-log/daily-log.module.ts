import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Daily-logController } from './controllers';
import { Daily-logService } from './services';
import { Daily-logEntity } from './entities';

@Module({
    imports: [TypeOrmModule.forFeature([Daily-logEntity])],
    controllers: [Daily-logController],
    exports: [Daily-logService],
    providers: [Daily-logService],
})
export class Daily-logModule {}
