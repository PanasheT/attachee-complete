import { Module } from '@nestjs/common';
import { GoogleDriveService } from './services';

@Module({
  imports: [],
  controllers: [],
  exports: [GoogleDriveService],
  providers: [GoogleDriveService],
})
export class GoogleDriveModule {}
