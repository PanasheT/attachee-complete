import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_CONFIG } from 'src/common';
import { CompanyModule } from './company/company.module';
import { DailyLogModule } from './daily-log/daily-log.module';
import { GitCommitModule } from './git-commit/git-commit.module';
import { ProjectModule } from './project/project.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({ isGlobal: true }),
    TypeOrmModule.forRootAsync(DB_CONFIG),
    StudentModule,
    DailyLogModule,
    ProjectModule,
    GitCommitModule,
    CompanyModule,
  ],
})
export class AppModule {}
