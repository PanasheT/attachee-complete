import { Module } from '@nestjs/common';
import { GoogleDriveController } from './controllers';
import { GoogleDriveService } from './services';

@Module({
  imports: [],
  controllers: [GoogleDriveController],
  exports: [GoogleDriveService],
  providers: [GoogleDriveService],
})
export class GoogleDriveModule {}
