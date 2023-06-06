import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from 'src/common';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { DailyLogModule } from './daily-log/daily-log.module';
import { GitCommitModule } from './git-commit/git-commit.module';
import { GoogleDriveModule } from './google-drive/google-drive.module';
import { MyListenerService } from './my-listener.service';
import { PdfModule } from './pdf/pdf.module';
import { ProjectLogModule } from './project-log/project-log.module';
import { ProjectModule } from './project/project.module';
import { StudentModule } from './student/student.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { TaskModule } from './task/task.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync(DB_CONFIG),
    StudentModule,
    DailyLogModule,
    ProjectModule,
    GitCommitModule,
    CompanyModule,
    ProjectLogModule,
    AuthModule,
    PdfModule,
    GoogleDriveModule,
    SupervisorModule,
    WhatsappModule,
    TaskModule,
  ],
  controllers: [ApiController],
  providers: [MyListenerService],
})
export class AppModule {}
