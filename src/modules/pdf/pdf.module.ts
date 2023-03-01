import { Module } from '@nestjs/common';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { PdfService } from './services/pdf.service';

@Module({
  imports: [GoogleDriveModule],
  exports: [PdfService],
  providers: [PdfService],
})
export class PdfModule {}
