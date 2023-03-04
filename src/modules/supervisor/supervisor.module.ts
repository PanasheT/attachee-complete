import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupervisorController } from './controllers';
import { SupervisorEntity } from './entities';
import { SupervisorService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([SupervisorEntity])],
  controllers: [SupervisorController],
  exports: [SupervisorService],
  providers: [SupervisorService],
})
export class SupervisorModule {}
