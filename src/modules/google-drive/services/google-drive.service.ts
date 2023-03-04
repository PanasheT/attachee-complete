import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { drive_v3, google } from 'googleapis';

@Injectable()
export class GoogleDriveService {
  private logger = new Logger(GoogleDriveService.name);

  private readonly scopes = ['https://www.googleapis.com/auth/drive'];

  private readonly localLogStoragePath: string = 'PDF_LOGS/projects/';

  constructor(private readonly configService: ConfigService) {}

  private async getGoogleDrive() {
    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
          private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY'),
        },
        scopes: this.scopes,
      });

      return google.drive({ version: 'v3', auth });
    } catch (error) {
      this.logger.error(`Failed to retrieve Google Drive client: ${error}`);
    }
  }

  public async uploadFile(fileName: string): Promise<string> {
    try {
      const googleDrive = await this.getGoogleDrive();

      if (!googleDrive) return;

      const { metadata, pdf } = this.createFileMetadataAndPdfStream(fileName);

      const { data } = await googleDrive.files.create({
        requestBody: metadata,
        media: {
          mimeType: 'application/pdf',
          body: pdf,
        },
      });

      return data?.id;
    } catch (error) {
      this.logger.error(`Failed: File ${fileName} upload error: ${error}`);
    }
  }

  private createFileMetadataAndPdfStream(fileName: string): {
    metadata: drive_v3.Schema$File;
    pdf: fs.ReadStream;
  } {
    const description = fileName.startsWith('Project_Log')
      ? 'Project Log summary for a specific project. Details include tasks completed, the log date and notes.'
      : fileName.startsWith('Daily_Log')
      ? 'Daily (Attachment) Log for specified date. Details include a description of the tasks performed, difficulties faced, notes and check-in/check-out times.'
      : null;

    return {
      metadata: {
        description,
        name: `${fileName}.pdf`,
        mimeType: 'application/pdf',
        parents: [this.configService.get<string>('GOOGLE_DRIVE_FOLDER_ID')],
      },
      pdf: fs.createReadStream(`${this.localLogStoragePath}${fileName}.pdf`),
    };
  }
}
