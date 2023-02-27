import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { AuthController } from './controllers';
import { AuthService } from './services';

@Module({
  imports: [StudentModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService],
})
export class AuthModule {}
