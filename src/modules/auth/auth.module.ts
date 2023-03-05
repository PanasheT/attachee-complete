import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONFIG } from 'src/common/jwt.config';
import { JwtGuard } from 'src/guards';
import { StudentModule } from '../student/student.module';
import { AuthController } from './controllers';
import { AuthFactory } from './factories';
import { AuthService } from './services';

@Module({
  imports: [StudentModule, JwtModule.registerAsync(JWT_CONFIG)],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    AuthFactory,
    JwtGuard,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AuthModule {}
